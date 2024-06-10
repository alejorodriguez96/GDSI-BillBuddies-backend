const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const registerRoute = require('./routes/register');
const authRoute = require('./routes/auth');
const groupsRoute = require('./routes/groups');
const favoritesRoute = require('./routes/favorites');
const notificationsRoute = require('./routes/notifications');
const userRoute = require('./routes/users');
const categoryRoute = require('./routes/categories');
const debtsRoute = require('./routes/debts');
const dashboardRoute = require('./routes/dashboards');
const authMiddleware = require('./middlewares/auth');
const cors = require('cors');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(express.json());
app.use(cors());

app.use('/register', registerRoute);
app.use('/auth', authRoute);
app.use('/groups', authMiddleware, groupsRoute);
app.use('/favorites', authMiddleware, favoritesRoute);
app.use('/notifications', authMiddleware, notificationsRoute);
app.use('/users', authMiddleware, userRoute);
app.use('/categories', authMiddleware, categoryRoute);
app.use('/debts', authMiddleware, debtsRoute);
app.use('/dashboards', authMiddleware, dashboardRoute);

const PORT = process.env.NODE_PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
