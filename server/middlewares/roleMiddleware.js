const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                success: false,
                message: 'Attempting to verify role without token validation'
            });
        }

        const { role, email } = req.user;
        
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: `User ${email} lacks required permissions: [${allowedRoles}]`
            });
        }

        next();
    };
};

module.exports = requireRole;