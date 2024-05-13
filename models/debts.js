const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { User } = require('./user');

const UserDebts = sequelize.define('UserDebts', {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'user_debts',
});

User.hasOne(UserDebts);
module.exports = {
    UserDebts
}