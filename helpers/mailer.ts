import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BRAVO_USER,
    pass: process.env.BRAVO_PASS,
  },
});


export const send_email = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: '"MDX Editor OTP" <rafat.alam.ra@gmail.com>',
    to,
    subject,
    html,
  });
};