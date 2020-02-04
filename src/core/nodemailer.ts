import nodemailer from 'nodemailer';

const trasporter = nodemailer.createTransport(
{
    host: process.env.MAILER_HOST,
    port: Number(process.env.MAILER_PORT),
    secure: Boolean(process.env.MAILER_SECURE),
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
}
},
{
    from: 'Test Mail <chat-name@mail.ru>'
})

export default trasporter;