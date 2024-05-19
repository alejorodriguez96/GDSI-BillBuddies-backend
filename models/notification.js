const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { User } = require('./user');
const e = require('express');

const NOTIFICATION_TYPES = Object.freeze({
    NEW_GROUP: 'NEW_GROUP',
    PENDING_DEBT: 'PENDING_DEBT',
    PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
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
    constructor(inviter, group, targetUser) {
        super();
        this.message = `${inviter.first_name} ${inviter.last_name} te invitó a unirte al grupo ${group.name}`;
        this.type = NOTIFICATION_TYPES.NEW_GROUP;
        this.data = { 
            groupId: group.id,
            inviterId: inviter.id,
        };
        this.read = false;
        this.UserId = targetUser.id;
    }
}

class DebtNotification extends Notification {
    constructor(userToPay, amount, group, targetUser) {
        super();
        this.message = `Tienes una deuda pendiente por $${amount} con ${userToPay.first_name} ${userToPay.last_name} en el grupo ${group.name}`;
        this.type = NOTIFICATION_TYPES.PENDING_DEBT;
        this.data = { 
            groupId: group.id,
            userToPayId: userToPay.id,
            amount: amount,
        };
        this.read = false;
        this.UserId = targetUser.id;
    }
}

class PaymentNotification extends Notification {
    constructor(payUser, amount, group, targetUserID) {
        super();
        this.message = `Recibiste un pago por $${amount} de ${payUser.first_name} ${payUser.last_name} en el grupo ${group.name}`;
        this.type = NOTIFICATION_TYPES.PAYMENT_RECEIVED;
        this.data = { 
            groupId: group.id,
            payUserId: payUser.id,
            amount: amount,
        };
        this.read = false;
        this.UserId = targetUserID;
    }
}

module.exports = {
    Notification,
    NOTIFICATION_TYPES,
    InviteNotification,
    DebtNotification,
    PaymentNotification,
};
