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

Bill.belongsTo(Category);
Category.hasMany(Bill);

async function findCategoryById(category_id) {
    const category = await Category.findByPk(category_id);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
}

module.exports = {
    Category,
    findCategoryById
}
