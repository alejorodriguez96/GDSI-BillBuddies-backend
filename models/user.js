const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
    },
    hash: {
        type: DataTypes.STRING,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'users',
});

async function findUserById(user_id) {
    const user = await User.findByPk(user_id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

module.exports = {
    User,
    findUserById
}
