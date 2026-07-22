import nodemailer from 'nodemailer';
import ENV_CONFIG from './env.config';

//transporter
export const transporter = nodemailer.createTransport({
    host: ENV_CONFIG.EMAIL_HOST,
    service: ENV_CONFIG.EMAIL_SERVICE,
    port: Number(ENV_CONFIG.EMAIL_PORT),
    secure:Number(ENV_CONFIG.EMAIL_PORT) === 465,
    auth: {
        user: ENV_CONFIG.EMAIL_USER,
        pass: ENV_CONFIG.EMAIL_PASS,
    },
});


//verify smtp
export const verifySMTP = async () => {
    try {
        await transporter.verify();
        console.log('Server is ready to send email');
    } catch (error) {
        console.log(error);
    }
}