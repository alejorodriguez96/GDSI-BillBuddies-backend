const express = require('express');
const app = express();
const { sequelize } = require('./db');
const registerRoute = require('./routes/register');
const authRoute = require('./routes/auth');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(express.json());

app.use('/register', registerRoute);
app.use('/auth', authRoute);

const PORT = process.env.NODE_PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
