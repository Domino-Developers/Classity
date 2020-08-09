const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports = sendMail = async (to, subject, html, text) =>
    transport.sendMail({
        from: '"Classity" <dominodevelopers@outlook.com>',
        to,
        subject,
        text,
        html
    });
