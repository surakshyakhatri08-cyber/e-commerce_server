import ENV_CONFIG from '../config/env.config';
import { transporter } from '../config/nodemailer.config';

interface IMailOptions {
    to: string | string[];
    subject: string;
    html: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments: any[];
}
export const sendEmail = async (options: IMailOptions) => {
    try {
        const mailOptions: any = {
            to: options.to,
            html: options.html,
            subject: options.subject,
            from: `'${ENV_CONFIG.SENDER_NAME}' <${ENV_CONFIG.EMAIL_USER}>`,
        };

        if(options.cc) {
            mailOptions['cc'] = options.cc;
        }
                
        if(options.bcc) {
            mailOptions['bcc'] = options.cc;
        }

        await transporter.sendMail(mailOptions);

        console.log('email send');
    } catch (error) {
        console.log(error);
    }
}