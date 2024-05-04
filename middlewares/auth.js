const { User } = require('../models/user');

async function auth(req, res, next) {
    const { hash } = req.headers;

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