const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const md5 = require('md5');

const router = express.Router();

/**
 * @openapi
 * '/register':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a user
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
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server Error
 */
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password.toString(), 10);
        const user = await User.create({ email, password: encryptedPassword});
        const hashedUserId = md5(user.id.toString());
        user.hash = hashedUserId;
        await user.save();
        const response = {
            email: user.email,
            hash: user.hash
        };
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
