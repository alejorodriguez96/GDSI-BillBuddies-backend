const express = require('express');
const { getDashboardToken } = require('../controllers/dashboard');

const router = express.Router();

/**
 * @openapi
 * '/dashboards/user':
 *  get:
 *     tags:
 *     - Dashboard Controller
 *     summary: Get user dashboard token
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
router.get('/user', getDashboardToken);

module.exports = router;
