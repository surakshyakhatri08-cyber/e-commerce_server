"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const env_config_1 = __importDefault(require("../config/env.config"));
const nodemailer_config_1 = require("../config/nodemailer.config");
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            to: options.to,
            html: options.html,
            subject: options.subject,
            from: `'${env_config_1.default.SENDER_NAME}' <${env_config_1.default.EMAIL_USER}>`,
        };
        if (options.cc) {
            mailOptions['cc'] = options.cc;
        }
        if (options.bcc) {
            mailOptions['bcc'] = options.cc;
        }
        await nodemailer_config_1.transporter.sendMail(mailOptions);
        console.log('email send');
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendEmail = sendEmail;
