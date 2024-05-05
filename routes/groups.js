const express = require('express');
const { Group } = require('../models/group');

const router = express.Router();


/**
 * @openapi
 * '/groups/{id}':
 *  get:
 *     tags:
 *     - Groups Controller
 *     summary: Get a group by id
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: Group id
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const group = await Group.findByPk(id);
        if (!group) {
            throw new Error('Group not found');
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @openapi
 * '/groups':
 *  post:
 *     tags:
 *     - Groups Controller
 *     summary: Create a group
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                default: My Group
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server Error
 */
router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        const group = await Group.create({ name });
        group.addUser(req.user);
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
