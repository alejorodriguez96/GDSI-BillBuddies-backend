const { Debts } = require('../models/debts'); // Asegúrate de que la ruta es correcta
const { User } = require('../models/user');
const { createObjectCsvStringifier } = require('csv-writer');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');


async function getCsvDebtsReport(req, res) {

    const { user } = req;
    const user_id_owner = user.id;

    console.log(`User ID: ${user_id_owner}`);


    const debts = await Debts.findAll({
        attributes: ['amount', 'amountPaid', 'groupId', 'userFromId', 'userToId'],
        where: {
            [Op.or]: [
                { userFromId: user_id_owner },
                { userToId: user_id_owner }
            ]
        },
        include: [
          { model: User, as: 'UserFrom' },
          { model: User, as: 'UserTo' }
        ]
    });

    // Asegúrate de manejar los resultados y posibles errores
    if (!debts) {
        return res.status(404).json({ error: 'No debts found' });
    }

    // const csvWriter = createObjectCsvWriter({
    //     path: path.join(__dirname, 'debts_report.csv'),
    //     header: [
    //         { id: 'amount', title: 'Amount' },
    //         { id: 'amountPaid', title: 'amount_paid' },
    //         { id: 'groupId', title: 'group_id' },
    //         { id: 'userFromId', title: 'user_id to_pay' },
    //         { id: 'userToId', title: 'user_id_debt' },
    //     ]
    // });


    // await csvWriter.writeRecords(debts.map(debt => debt.dataValues));

    // // Envía el archivo CSV como respuesta
    // res.sendFile(path.join(__dirname, 'debts_report.csv'));

    // Crear el CSV en memoria
    const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: 'amount', title: 'Amount' },
            { id: 'amountPaid', title: 'Amount Paid' },
            { id: 'groupId', title: 'Group ID' },
            { id: 'userFromId', title: 'User From ID' },
            { id: 'userToId', title: 'User To ID' },
        ]
    });

    const csvHeader = csvStringifier.getHeaderString();
    const csvBody = csvStringifier.stringifyRecords(debts.map(debt => debt.dataValues));
    const csvString = csvHeader + csvBody;

    // Convertir a base64
    const csvBase64 = Buffer.from(csvString).toString('base64');

    // Devolver en el campo `data` del cuerpo de la respuesta
    res.json({ data: csvBase64 });

}

module.exports = {
    getCsvDebtsReport,
}