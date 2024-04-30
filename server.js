const express = require('express');
const app = express();
const { sequelize } = require('./db');
const registerRoute = require('./routes/register');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(express.json());

app.use('/register', registerRoute);

const PORT = process.env.NODE_PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
