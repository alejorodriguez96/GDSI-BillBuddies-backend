const { User } = require('../models/user');

async function auth(req, res, next) {
    const { authorization } = req.headers;
    console.log(req.headers);
    if (!authorization) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const hash = authorization.replace('Bearer ', '');

    try {
        const user = await User.findOne({ where: { hash } });
        if (!user) {
            throw new Error('Unauthorized');
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}

module.exports = auth;