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
    hash: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'users',
});

module.exports = {
    User
}
