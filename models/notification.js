const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { User } = require('./user');
const e = require('express');

const NOTIFICATION_TYPES = Object.freeze({
    NEW_GROUP: 'NEW_GROUP',
});

const Notification = sequelize.define('Notification', {
    message: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.JSON,
    },
    read: {
        type: DataTypes.BOOLEAN,
    }
}, {
    tableName: 'notifications'
});

Notification.belongsTo(User);
User.hasMany(Notification);

class InviteNotification extends Notification {
    constructor(inviter, group) {
        super();
        this.message = `${inviter.firstName} ${inviter.lastName} te invitó a unirte al grupo ${group.name}`;
        this.type = NOTIFICATION_TYPES.NEW_GROUP;
        this.data = { 
            groupId: group.id,
            inviterId: inviter.id,
        };
        this.read = false;
    }
}

module.exports = {
    Notification,
    NOTIFICATION_TYPES,
    InviteNotification,
};
