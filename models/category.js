const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { Bill } = require('./bills');

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
    },
    color: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'categories'
});

Bill.hasOne(Category);
Category.belongsTo(Bill);

module.exports = {
    Category
}
