const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();


 /**
 * @openapi
 * '/categories':
 *  get:
 *     tags:
 *     - Category Controller
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

module.exports = router;
