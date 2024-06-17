const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { User } = require('./user');
const { Group } = require('./group');

const Bill = sequelize.define('Bill', {
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    pendingDebts: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paidOff: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isInInstallments: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    installment: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    totalInstallments: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
}, {
    tableName: 'bills',
});

Group.hasMany(Bill, { foreignKey: 'GroupId' }); 
Bill.belongsTo(User, { foreignKey: 'UserId' });

module.exports = {
    Bill
}