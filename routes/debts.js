const express = require('express');
const { makeDivision } = require('../controllers/debts');

const router = express.Router();

/**
 * @openapi
 * '/debts/divide':
 *  put:
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
 *              - mode
 *            properties:
 *              group_id:
 *                type: integer
 *                default: 1
 *              mode:
 *                type: string
 *                default: equitative
 *     responses:
 *      200:
 *        description: Divide Successful
 *      404:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 */
router.put('/divide', makeDivision);

module.exports = router;