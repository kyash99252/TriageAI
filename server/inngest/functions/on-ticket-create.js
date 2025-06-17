import { NonRetriableError } from "inngest";
import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";
import User from "../../models/user.js";

export const onTicketCreated = inngest.createFunction(
    { id: 'on-ticket-created', retries: 2 },
    { event: 'ticket/created' },
    async ({ event, step }) => {
        try {
            const { ticketId } = event.data;

            const ticket = await step.run('fetch-and-prep-ticket', async () => {
                const ticketObject = await Ticket.findByIdAndUpdate(
                    ticketId,
                    { status: "TODO" },
                    { new: true }
                );

                if (!ticketObject) {
                    throw new NonRetriableError('Ticket not found');
                }
                return ticketObject;
            });

            console.log(`Processing ticket ${ticket._id} with title "${ticket.title}"`);

            const aiResponse = await analyzeTicket(ticket);
            console.log(`AI analysis for ticket ${ticket._id}:`, aiResponse);

            if (!aiResponse || !aiResponse.relatedSkills) {
                console.log(`AI analysis did not return sufficient data for ticket ${ticket._id}.`);
                await step.run('mark-ticket-as-needs-review', async () => {
                    await Ticket.findByIdAndUpdate(ticket._id, { status: "NEEDS_MANUAL_REVIEW" });
                });
                return { success: false, reason: "AI analysis failed." };
            }

            const moderator = await step.run('find-moderator', async () => {
                let user = await User.findOne({
                    role: 'moderator',
                    skills: {
                        $in: aiResponse.relatedSkills.map(skill => new RegExp(skill, 'i'))
                    }
                });

                if (!user) {
                    user = await User.findOne({ role: 'admin' });
                }

                return user;
            });

            const finalTicket = await step.run('assign-and-finalize-ticket', async () => {
                return await Ticket.findByIdAndUpdate(
                    ticket._id,
                    {
                        priority: !['low', 'medium', 'high'].includes(aiResponse.priority) ? 'medium' : aiResponse.priority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        status: 'IN_PROGRESS',
                        relatedSkills: aiResponse.relatedSkills,
                        assignedTo: moderator?._id || null,
                    },
                    { new: true }
                );
            });

            await step.run('send-email-notification', async () => {
                if (moderator) {
                    await sendMail(
                        moderator.email,
                        'New Ticket Assigned to You',
                        `A new ticket has been assigned to you: "${finalTicket.title}"`
                    );
                }
            });

            return { success: true };
        } catch (error) {
            console.error('❌ Error running on-ticket-created function', error);
            throw error;
        }
    }
);