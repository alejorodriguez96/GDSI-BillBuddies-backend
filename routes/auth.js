const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const router = express.Router();

/**
 * @openapi
 * '/auth/login':
 *  post:
 *     tags:
 *     - Users Controller
 *     summary: Login a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: johnDoe20!@
 *     responses:
 *      200:
 *        description: Logged in
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server Error
 */
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
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            hash: user.hash
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;