const { Sequelize } = require('sequelize');

const database = process.env.DB_NAME || 'dev_db';
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || "123456";
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || 5432;

const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'postgres',
});

console.log('Connecting to database...');
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

console.log('Syncing database...');
sequelize.sync()
    .then(() => {
        console.log('Database synchronized.');
    })
    .catch((error) => {
        console.error('Unable to sync database:', error);
    });

module.exports = {
    sequelize
}
