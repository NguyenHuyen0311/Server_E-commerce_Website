import http from 'http';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config(); 

// Configure the SMTP transport using nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendEmail(to, subject, text, html) {
    try {
        const info = await transporter.sendMail({
            from: `"Onimarket Ecommerce" <${process.env.EMAIL}>`,
            to,
            subject,
            text,
            html,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export default sendEmail;