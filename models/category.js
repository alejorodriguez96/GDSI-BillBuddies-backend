const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { Bill } = require('./bills');
const { Group } = require('./group');

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
Group.belongsToMany(Category, { through: 'CategoryGroup' });
Category.belongsToMany(Group, { through: 'CategoryGroup' });

async function findCategoryById(category_id) {
    const category = await Category.findByPk(category_id);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
}

async function setDefaultCategories(group) {
    for(i=1;i<9;i++) {
        try {

            const category = await findCategoryById(i);
            await group.addCategory(category);
            await group.save();
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    Category,
    findCategoryById,
    setDefaultCategories
}
