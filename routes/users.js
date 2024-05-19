const express = require('express');
const { User } = require('../models/user');
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

module.exports = router;
