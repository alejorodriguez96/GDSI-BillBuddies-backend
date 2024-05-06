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

module.exports = router;
