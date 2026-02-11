const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Access denied. Invalid or missing token.' 
        });
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = payload; 
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError' 
            ? 'Token has expired' 
            : 'Invalid token';

        return res.status(401).json({ success: false, message });
    }
};

module.exports = verifyToken;