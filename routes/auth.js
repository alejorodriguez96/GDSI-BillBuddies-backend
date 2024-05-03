const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const md5 = require('md5');

const router = express.Router();

router.post('/login/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid email');
        }
        const isPasswordValid = await bcrypt.compare(password.toString(), user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const response = {
            email: user.email,
            hash: user.hash
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;