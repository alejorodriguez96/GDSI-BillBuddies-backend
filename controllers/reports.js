const { Debts } = require('../models/debts');
const { User } = require('../models/user');
const { Group } = require('../models/group');
const { createObjectCsvStringifier } = require('csv-writer');
const { Op } = require('sequelize');


async function getCsvDebtsReport(req, res) {

    const { user } = req;
    const user_id_owner = user.id;

    const debts = await Debts.findAll({
        attributes: ['amount', 'amountPaid', 'userFromId', 'userToId'],
        where: {
            [Op.or]: [
                { userFromId: user_id_owner },
                { userToId: user_id_owner }
            ]
        },
        include: [
            { model: User, as: 'UserFrom', attributes: ['id', 'first_name', 'last_name'] },
            { model: User, as: 'UserTo', attributes: ['id', 'first_name', 'last_name'] },
            { model: Group, attributes: ['id', 'name'] }
        ]
    });

    if (!debts) {
        return res.status(404).json({ error: 'No debts found' });
    }

    const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: 'groupName', title: 'group_name' },
            { id: 'userFromFullName', title: 'debtor_user' },
            { id: 'userToFullName', title: 'user_to_pay' },
            { id: 'remainingAmount', title: 'remaining_amount' },
        ]
    });

    const csvHeader = csvStringifier.getHeaderString();
    // const csvBody = csvStringifier.stringifyRecords(debts.map(debt => debt.dataValues));
    const csvBody = csvStringifier.stringifyRecords(debts.map(debt => {
        const { amount, amountPaid } = debt;
        const remainingAmount = amount - amountPaid;
        const groupName = debt.Group ? debt.Group.name : '';
        const userFromFullName = debt.UserFrom ? `${debt.UserFrom.first_name} ${debt.UserFrom.last_name}` : '';
        const userToFullName = debt.UserTo ? `${debt.UserTo.first_name} ${debt.UserTo.last_name}` : '';
        return {
            groupName,
            userFromFullName,
            userToFullName,
            remainingAmount
        };
    }));
    const csvString = csvHeader + csvBody;

    const csvBase64 = Buffer.from(csvString).toString('base64');
    res.json({ data: csvBase64 });
}

module.exports = {
    getCsvDebtsReport,
}