const express = require('express');
const router = express.Router();

/**
 * @openapi
 * '/favorites':
 *  get:
 *     tags:
 *     - Groups Controller
 *     summary: Get favorite groups
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
        const groups = await user.getGroups();
        const favoriteGroups = groups.filter((group) => group.UserGroup.favorite);
        res.status(200).json(favoriteGroups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;