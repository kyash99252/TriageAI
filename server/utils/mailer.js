import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: '"Inngest TMS',
            to,
            subject,
            text,
            html
        });

        console.log(`✅ Message Sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`⚠️ Mail Error: ${error}`)
        throw error;
    }
}