import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';
import { SMTP } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: env(SMTP.SMTP_PORT),
  secure: false,
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendMail = async (message) => {
  return await transporter.sendMail(message);
};
