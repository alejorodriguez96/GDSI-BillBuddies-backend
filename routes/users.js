const express = require('express');
const { User } = require('../models/user');
const { hash } = require('bcrypt');
const { UserConfig } = require('../models/user_configs');
const router = express.Router();


 /**
 * @openapi
 * '/users':
 *  get:
 *     tags:
 *     - Users Controller
 *     summary: Get all users
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: q
 *       required: false
 *       schema:
 *        type: string
 *       description: User search name
 *     responses:
 *      200:
 *        description: OK
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
router.get('/', async (req, res) => {
    const { q } = req.query;
    try {
        let users = await User.findAll();
        if (q) {
            // This is NOT PERFORMANT AT ALL. But it's easy to understand.
            users = users.filter(user => {
                return (user.first_name + ' ' + user.last_name).toLowerCase().includes(q.toLowerCase());
            });
        }
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

 /**
 * @openapi
 * '/users/{id}':
 *  get:
 *     tags:
 *     - Users Controller
 *     summary: Get a user by id
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: User id
 *     responses:
 *      200:
 *        description: OK
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
 router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).json({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone,
                id: user.id,
                hash: user.hash
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

 /**
 * @openapi
 * '/users/{id}':
 *  patch:
 *     tags:
 *     - Users Controller
 *     summary: Get a user by id
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
 *              first_name:
 *                type: string
 *                default: John
 *              last_name:
 *                type: string
 *                default: Doe
 *              phone:
 *                type: string
 *                default: 123456789
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: User id
 *     responses:
 *      200:
 *        description: OK
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
 router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone_number } = req.body;
    try {
        const user = await User.findByPk(id);
        if (user) {
            user.first_name = first_name;
            user.last_name = last_name;
            user.phone = phone_number;
            await user.save();
            res.status(200).json({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone,
                id: user.id,
                hash: user.hash
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});


 /**
 * @openapi
 * '/users/{id}/config':
 *  put:
 *     tags:
 *     - Users Controller
 *     summary: Modify user configuration
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - allowNotifications
 *              - allowEmailNotifications
 *            properties:
 *              allowNotifications:
 *                type: boolean
 *                default: true
 *              allowEmailNotifications:
 *                type: boolean
 *                default: true
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: User id
 *     responses:
 *      200:
 *        description: OK
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
 router.put('/:id/config', async (req, res) => {
    const { id } = req.params;
    const { allowNotifications, allowEmailNotifications } = req.body;
    const keysToUpdate = ['allowNotifications', 'allowEmailNotifications'];
    try {
        const user = await User.findByPk(id);
        if (user) {
            for (let i = 0; i < keysToUpdate.length; i++) {
                const key = keysToUpdate[i];
                const config = await UserConfig.findOne({ where: { UserId: user.id, config_key: key } });
                if (!config) {
                    await UserConfig.create({ UserId: user.id, config_key: key, config_value: req.body[key] });
                    continue;
                }
                config.config_value = req.body[key];
                await config.save();
            }
            res.status(200).json({
                allowNotifications,
                allowEmailNotifications
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

 /**
 * @openapi
 * '/users/{id}/config':
 *  get:
 *     tags:
 *     - Users Controller
 *     summary: Get user configuration
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: User id
 *     responses:
 *      200:
 *        description: OK
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
 router.get('/:id/config', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            const configs = await UserConfig.findAll({ where: { UserId: user.id } });
            const response = configs.reduce((acc, config) => {
                acc[config.config_key] = config.config_value;
                return acc;
            }, {});
            res.status(200).json(response);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
