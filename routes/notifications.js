const express = require('express');
const { Notification } = require('../models/notification');
const router = express.Router();

/**
 * @openapi
 * '/notifications':
 *  get:
 *     tags:
 *     - Notifications Controller
 *     summary: Get all notifications
 *     security:
 *      - bearerAuth: []
 *     responses:
 *      200:
 *        description: OK
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
router.get('/', async (req, res) => {
    const { user } = req;
    try {
        const notifications = await user.getNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @openapi
 * '/notifications/{id}':
 *  patch:
 *     tags:
 *     - Notifications Controller
 *     summary: 
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: Notification id
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
    try {
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        await notification.update({ read: true });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
