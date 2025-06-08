import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import User from '../../models/user.js';
import {sendMail} from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
    { id: 'on-user-signup', retries: 2 },
    { event: 'user/signup' },

    async ({ event, steps }) => {
        try {
            const { email } = event.data;
            await steps.run('get-user-email', async () => {
                const userObject = await User.findOne({ email });
                if (!userObject) {
                    throw new NonRetriableError('❌ User no longer exists in database...')
                }
                return userObject;
            })

            await steps.run('send-welcome-email', async () => {
                const subject = 'Welcome to the app';
                const message = `Hi
                \n\n
                Thanks for signing in. We are glad to have you onboard!`;
                await sendMail(user.email, subject, message);
            })

            return { success: true };
        } catch (error) {
            console.error(`❌ Error running step ${error.message}`);
            return { success: false };
        }
    }
)