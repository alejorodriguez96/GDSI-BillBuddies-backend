const express = require('express');
const { getDashboardToken, getGroupDashboardToken, getSlimDashboardToken } = require('../controllers/dashboard');

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

/**
 * @openapi
 * '/dashboards/slim':
 *  get:
 *     tags:
 *     - Dashboard Controller
 *     summary: Get user slim dashboard token
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
router.get('/slim', getSlimDashboardToken);

/**
 * @openapi
 * '/dashboards/group':
 *  get:
 *     tags:
 *     - Dashboard Controller
 *     summary: Get group dashboard token
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
router.get('/group', getGroupDashboardToken);

module.exports = router;
