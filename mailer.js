const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (to, subject, text, isHTML) => {
    try {
        if (isHTML) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                html: text
            });
            return;
        }
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    sendEmail,
}
