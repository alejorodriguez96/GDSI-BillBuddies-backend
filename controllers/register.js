const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const md5 = require('md5');
const { sendEmail } = require('../mailer');

async function sendVerificationEmail(user) {
    const email = user.email;
    const subject = 'Bienvenid@ a BillBuddies!';
    let text = `Hola ${user.first_name}, nos encanta que formes parte de BillBuddies!<br><br>`;
    text += 'Para verificar tu cuenta, por favor haz click en el siguiente link:<br>';
    text += `<a href="${process.env.FRONT_HOST}/register/verify?token=${user.hash}">Verificar cuenta</a><br><br>`;
    text += 'Gracias por confiar en nosotros!';
    await sendEmail(email, subject, text, true);
}

async function createUser(req, res) {
    const { email, password, first_name, last_name, phone } = req.body;
    
    try {
        const avoidValidation = process.env.NODE_ENV !== 'prod' && email.endsWith('@dummy.com');
        const encryptedPassword = await bcrypt.hash(password.toString(), 10);
        const user = await User.create({ 
            email,
            first_name,
            last_name,
            phone,
            password: encryptedPassword,
            verified: avoidValidation
        });
        const hashedUserId = md5(user.id.toString());
        user.hash = hashedUserId;
        await user.save();
        const response = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            hash: user.hash,
            id: user.id
        };
        if (!avoidValidation) {
            await sendVerificationEmail(user);
        }
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function verifyUser(req, res) {
    const { token } = req.query;
    try {
        const user = await User.findOne({ where: { hash: token } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.verified = true;
        await user.save();
        res.status(200).json({ message: 'User verified' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createUser,
    verifyUser
}
