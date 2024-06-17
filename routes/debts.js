const express = require('express');
const { Debts } = require('../models/debts');
const { Group } = require('../models/group');
const { User } = require('../models/user');
const { Bill } = require('../models/bills');
const { PaymentNotification } = require('../models/notification');
const { UserConfig } = require('../models/user_configs');
const router = express.Router();

/**
 * @openapi
 * '/debts':
 *  get:
 *     tags:
 *     - Debts Controller
 *     summary: Get all debts
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
    const { user } = req;
    try {
        const debts = await user.getDebtsFrom();
        const bills = await Bill.findAll();
        let result = [];
        for (let i = 0; i < debts.length; i++) {
            const debt = debts[i];
            const bill = bills.find(bill => bill.id == debt.billId);
            console.log(bill);
            const billDate = new Date(bill.createdAt);
            console.log(billDate);
            const installment = bill.isInInstallments ? bill.installment : 1;
            console.log(installment);
            const auxDate = new Date(billDate + (installment - 1) * 30 * 24 * 60 * 60 * 1000);
            console.log(auxDate);
            const show = new Date() >= auxDate;
            console.log(show);

            if (show) {
                result.push({ ...debt.dataValues, show});
            }
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @openapi
 * '/debts/{id}':
 *  patch:
 *     tags:
 *     - Debts Controller
 *     summary: Update the paid amount of the debt and its status
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: integer
 *       description: Debt id
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - amount
 *            properties:
 *              amount:
 *                type: float
 *                default: 200.0
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Resource not found
 *      500:
 *        description: Server Error
 */
router.patch('/:id', async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const debt = await Debts.findByPk(id);
        if (!debt) {
            return res.status(404).json({ error: 'Debt not found' });
        }
        if (debt.userFromId != user.id) {
            return res.status(400).json({ error: 'Debt not from this user' });
        }
        if (!debt.pending) {
            return res.status(400).json({ error: 'Debt already paid' });
        }
        if (debt.amount - debt.amountPaid < amount) {
            return res.status(400).json({ error: 'Pending amount is less than the intended to pay' });
        }
        await debt.update({ amountPaid: debt.amountPaid + amount });
        if (debt.amount == debt.amountPaid) {
            await debt.update({ pending: false });
            const bill = await Bill.findByPk(debt.billId);
            await bill.update({ pendingDebts: bill.pendingDebts - 1 });
            if (bill.pendingDebts == 0) {
                await bill.update({ paidOff: true });
            }
        }
        const group = await Group.findByPk(debt.groupId);
        const userToPay = await User.findByPk(debt.userToId);
        const notificationConfig = await UserConfig.findOne({ where: { UserId: userToPay.id, config_key: "allowNotifications" } });
        const showNotification = notificationConfig ? notificationConfig.config_value === 'true' : true;
        const emailNotificactionConfig = await UserConfig.findOne({ where: { UserId: userToPay.id, config_key: "allowEmailNotifications" } });
        const sendEmail = emailNotificactionConfig ? emailNotificactionConfig.config_value === 'true' : true;
        const notif = new PaymentNotification(user, amount, group, userToPay, sendEmail)
        if (showNotification) {
            await notif.save();
        }
        res.status(200).json(debt);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
