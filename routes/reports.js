const express = require('express');
const { getCsvDebtsReport } = require('../controllers/reports');

const router = express.Router();

/**
 * @openapi
 * '/reports/groups':
 *  get:
 *     tags:
 *     - Reports Controller
 *     summary: Get a Base64 csv report of groups
 *     security:
 *      - bearerAuth: []
 *     responses:
 *      200:
 *        description: OK
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Resource not found
 *      500:
 *        description: Server Error
 */
router.get('/groups', getCsvDebtsReport);

module.exports = router;