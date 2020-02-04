import nodemailer from 'nodemailer';

const trasporter = nodemailer.createTransport(
{
    host: 'smtp.mail.ru',
    port: 465,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
}
},
{
    from: 'Test Mail <chat-name@mail.ru>'
})

export default trasporter;