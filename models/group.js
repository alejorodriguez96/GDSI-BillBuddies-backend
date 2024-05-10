const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { User } = require('./user');

const Group = sequelize.define('Group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'groups',
});

const UserGroup = sequelize.define('UserGroup', {
    accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    rejected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup });

module.exports = {
    Group,
    UserGroup,
}
