const express = require('express');
const { createUser, verifyUser } = require('../controllers/register');
const e = require('express');

const router = express.Router();

/**
 * @openapi
 * '/register':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - first_name
 *              - last_name
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              first_name:
 *                type: string
 *                default: John
 *              last_name:
 *                type: string
 *                default: Doe
 *              password:
 *                type: string
 *                default: johnDoe20!@
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server Error
 */
router.post('/', createUser);

/**
 * @openapi
 * '/register/verify':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Verify a user
 *     parameters:
 *     - in: query
 *       name: token
 *       required: true
 *       schema:
 *        type: string
 *       description: User verification token
 *     responses:
 *      200:
 *        description: OK
 *      404:
 *        description: Resource not found
 *      500:
 *        description: Server Error
 */
router.get('/verify', verifyUser);

module.exports = router;
