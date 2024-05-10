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
 *              - first_name
 *              - last_name
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              first_name:
 *                type: string
 *                default: John
 *              last_name:
 *                type: string
 *                default: Doe
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
    const { email, password, first_name, last_name } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password.toString(), 10);
        const user = await User.create({ 
            email,
            first_name,
            last_name,
            password: encryptedPassword
        });
        const hashedUserId = md5(user.id.toString());
        user.hash = hashedUserId;
        await user.save();
        const response = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            hash: user.hash
        };
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
