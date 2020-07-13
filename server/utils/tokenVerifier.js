const jwt = require('jsonwebtoken');

const verifyToken = req => {
    const token = req.header('x-auth-token');
    if (!token) {
        return false;
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user;
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = { verifyToken };
