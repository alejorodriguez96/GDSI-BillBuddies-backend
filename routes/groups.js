const express = require('express');
const { getGroups, getAllGroups, createGroup, addGroupMember, removeGroupMember, acceptGroupInvitation, getGroupMembers } = require('../controllers/groups');

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
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Resource not found
 *      500:
 *        description: Server Error
 */
router.get('/:id', getGroups);


/**
 * @openapi
 * '/groups':
 *  get:
 *     tags:
 *     - Groups Controller
 *     summary: Get all groups
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
router.get('/', getAllGroups);


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
router.post('/', createGroup);

/**
 * @openapi
 * '/groups/{id}/integrant':
 *  post:
 *     tags:
 *     - Groups Controller
 *     summary: Add an integrant to a group
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: Group id
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *     responses:
 *      201:
 *        description: Created
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Resource not found
 *      500:
 *        description: Server Error
 */
router.post('/:id/integrant', addGroupMember);

/**
 * @openapi
 * '/groups/{id}/integrant':
 *  put:
 *     tags:
 *     - Groups Controller
 *     summary: Accept or reject a group invitation
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: Group id
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - accept
 *            properties:
 *              accept:
 *                type: string
 *                default: true
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
router.put('/:id/integrant', acceptGroupInvitation);

/**
 * @openapi
 * '/groups/{id}/integrant':
 *  delete:
 *     tags:
 *     - Groups Controller
 *     summary: Remove an integrant from a group
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: Group id
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@mail.com
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
 router.delete('/:id/integrant', removeGroupMember);

 /**
 * @openapi
 * '/groups/{id}/integrant':
 *  get:
 *     tags:
 *     - Groups Controller
 *     summary: Get all integrants from a group
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
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Resource not found
 *      500:
 *        description: Server Error
 */
 router.get('/:id/integrant', getGroupMembers);

module.exports = router;
