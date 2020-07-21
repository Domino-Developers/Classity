require('dotenv').config();
const nodemailer = require('nodemailer');

async function main() {
    var transport = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let info = await transport.sendMail({
        from: '"Classity" <dominodevelopers@outlook.com>',
        to: 'sanchit.arora.2002@gmail.com',
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>'
    });

    console.log('Message sent: %s', info.messageId);
}

main().catch(console.error);
