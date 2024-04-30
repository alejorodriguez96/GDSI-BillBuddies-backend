const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: encryptedPassword});
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
