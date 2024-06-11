const express = require('express');
const { getGroups, getAllGroups, createGroup, addGroupMember, removeGroupMember, acceptGroupInvitation, getGroupMembers, getGroupBills, addBillToGroup, getAllDebts, setGroupAsFavorite, getGroupCategories, addCategoryToGroup } = require('../controllers/groups');

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
 * '/groups/{id}':
 *  patch:
 *     tags:
 *     - Groups Controller
 *     summary: Change group favorite status
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
 router.patch('/:id', setGroupAsFavorite);

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
 *              - userId
 *            properties:
 *              userId:
 *                type: string
 *                default: 1
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

 /**
 * @openapi
 * '/groups/bill':
 *  post:
 *     tags:
 *     - Bills Controller
 *     summary: Create a bill for a group
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
 *              - bill_amount
 *              - mode
 *              - category_id
 *            properties:
 *              group_id:
 *                type: integer
 *                default: 1
 *              bill_amount:
 *                type: float
 *                default: 200.0
 *              mode:
 *                type: string
 *                default: equitative
 *              category_id:
 *                type: integer
 *                default: 1
 *              debts_list:
 *                type: array
 *                description: Optional list of debts for fixed mode
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      description: User ID
 *                      example: 1
 *                    amount:
 *                      type: number
 *                      format: float
 *                      description: Amount of debt
 *                      example: 200.0
 *                default:
 *                  - id: 1
 *                    amount: 200
 *           examples:
 *             equitativeExample:
 *               summary: Example with equitative mode
 *               value:
 *                 group_id: 1
 *                 bill_amount: 200.0
 *                 mode: equitative
 *                 category_id: 1
 *             fixedExample:
 *               summary: Example with fixed mode
 *               value:
 *                 group_id: 1
 *                 bill_amount: 300.0
 *                 mode: fixed
 *                 category_id: 1
 *                 debts_list:
 *                   - id: 1
 *                     amount: 150.0
 *                   - id: 2
 *                     amount: 150.0
 *             percentageExample:
 *               summary: Example with percentage mode
 *               value:
 *                 group_id: 1
 *                 bill_amount: 400.0
 *                 mode: percentage
 *                 category_id: 1
 *                 debts_list:
 *                   - id: 1
 *                     amount: 40
 *                   - id: 2
 *                     amount: 60
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Invalid mode or missing debts_list
 *      404:
 *        description: Resource not found
 */
 router.post('/bill', addBillToGroup);


 /**
 * @openapi
 * '/groups/{id}/bills':
 *  get:
 *     tags:
 *     - Bills Controller
 *     summary: Get all bills from a group
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
 *      404:
 *        description: Resource not found
 */
 router.get('/:id/bills', getGroupBills);

/**
 * @openapi
 * '/groups/{id}/categories':
 *  get:
 *     tags:
 *     - Categories Controller
 *     summary: Get all categories from a group
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
 *      404:
 *        description: Resource not found
 */
  router.get('/:id/categories', getGroupCategories);

/**
 * @openapi
 * '/groups/{id}/categories':
 *  post:
 *     tags:
 *     - Categories Controller
 *     summary: Create a category for a group
 *     security:
 *     - bearerAuth: []
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
 router.post('/:id/categories', addCategoryToGroup);

 /**
 * @openapi
 * '/groups/debts/{groupId}':
*  get:
 *     tags:
 *     - Debts Controller
 *     summary: Get all debts for a group
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: groupId
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
 */
router.get('/debts/:groupId', getAllDebts);

module.exports = router;
