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


async function findUserGroupOwner(group_id, user_id_owner) {
    const userGroupOwner = await UserGroup.findOne({
        where: {
            GroupId: group_id,
            UserId: user_id_owner
        }
    });
    if (!userGroupOwner) {
        throw new Error('UserGroup not found');
    }
    return userGroupOwner;
}

async function findGroupById(group_id) {
    const group = await Group.findByPk(group_id);
    if (!group) {
        throw new Error('Group not found');
    }
    return group;
}

async function getUsersInGroup(group) {
    const users = await group.getUsers();
    if (!users || users.length === 0) {
        throw new Error('There are no users in that group');
    }
    return users;
}

module.exports = {
    Group,
    UserGroup,
    findUserGroupOwner,
    findGroupById,
    getUsersInGroup
}
