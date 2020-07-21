const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports = {
    sendMail: async (to, subject, html, text) =>
        transport.sendMail({
            from: '"Classity" <dominodevelopers@outlook.com>',
            to: to,
            subject: subject,
            text: text,
            html: html
        })
};
