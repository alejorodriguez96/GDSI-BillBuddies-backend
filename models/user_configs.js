const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const { User } = require('./user');

const UserConfig = sequelize.define('UserConfig', {
    config_key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    config_value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {}
);

User.hasMany(UserConfig);
UserConfig.belongsTo(User);

const DEFAULT_USER_CONFIGS = [
    { config_key: 'allowNotifications', config_value: 'true' },
    { config_key: 'allowEmailNotifications', config_value: 'true' }
];

async function createInitialUserConfig(user_id) {
    for (let i = 0; i < DEFAULT_USER_CONFIGS.length; i++) {
        const config = DEFAULT_USER_CONFIGS[i];
        await UserConfig.create({ ...config, UserId: user_id });
    }
}

module.exports = {
    UserConfig,
    createInitialUserConfig
}
