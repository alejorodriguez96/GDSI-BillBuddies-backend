const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { User } = require('./user');
const { Group } = require('./group');

const Debts = sequelize.define('Debts', {
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    amountPaid: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    pending: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'debts',
});

Debts.belongsTo(User, { as: 'UserFrom', foreignKey: 'userFromId' });
Debts.belongsTo(User, { as: 'UserTo', foreignKey: 'userToId' });
Debts.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(Debts, { foreignKey: 'userFromId', as: 'DebtsFrom' });
User.hasMany(Debts, { foreignKey: 'userToId', as: 'DebtsTo' });

module.exports = {
    Debts
}