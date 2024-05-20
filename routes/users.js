const express = require('express');
const { User } = require('../models/user');
const { hash } = require('bcrypt');
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


module.exports = router;
