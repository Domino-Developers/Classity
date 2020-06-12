const jwt = require('jsonwebtoken');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description middleware to check token and protect private routes
 */
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Token not found access denied'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Invalid token' });
    }
};

module.exports = auth;
