const express = require('express');
const { equitativeDivision } = require('../controllers/debts');

const router = express.Router();

/**
 * @openapi
 * '/debts/divide':
 *  post:
 *     tags:
 *     - Debts Controller
 *     summary: Divide equality a bill of a group
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - group_id
 *            properties:
 *              group_id:
 *                type: integer
 *                default: 1
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
router.post('/', equitativeDivision);

module.exports = router;