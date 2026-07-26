"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySMTP = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = __importDefault(require("./env.config"));
//transporter
exports.transporter = nodemailer_1.default.createTransport({
    host: env_config_1.default.EMAIL_HOST,
    service: env_config_1.default.EMAIL_SERVICE,
    port: Number(env_config_1.default.EMAIL_PORT),
    secure: Number(env_config_1.default.EMAIL_PORT) === 465,
    auth: {
        user: env_config_1.default.EMAIL_USER,
        pass: env_config_1.default.EMAIL_PASS,
    },
});
//verify smtp
const verifySMTP = async () => {
    try {
        await exports.transporter.verify();
        console.log('Server is ready to send email');
    }
    catch (error) {
        console.log(error);
    }
};
exports.verifySMTP = verifySMTP;
