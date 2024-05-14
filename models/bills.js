const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { User } = require('./user');
const { Group } = require('./group');

const Bill = sequelize.define('Bill', {
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
}, {
    tableName: 'bills',
});

Group.hasMany(Bill, { foreignKey: 'GroupId' }); 
Bill.belongsTo(User, { foreignKey: 'UserId' });

module.exports = {
    Bill
}