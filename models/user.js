const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'users',
});

module.exports = {
    User
}
