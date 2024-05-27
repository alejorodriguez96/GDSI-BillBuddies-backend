const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();


 /**
 * @openapi
 * '/categories':
 *  get:
 *     tags:
 *     - Categories Controller
 *     summary: Get all categories
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
    try {
        let categories = await Category.findAll();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @openapi
 * '/categories':
 *  post:
 *     tags:
 *     - Categories Controller
 *     summary: Create a category
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
 *                default: Gift
 *              icon:
 *                type: string
 *                default: 🎁
 *              color:
 *                type: string
 *                default: "#FF69B4"
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
    const { name, icon, color } = req.body;

    try {
        const category = await Category.create({ name, icon, color });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
