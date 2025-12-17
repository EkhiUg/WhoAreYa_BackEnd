const jwt = require('jsonwebtoken');
const config = require('../config/index');
const User = require('../models/User');

// Saioa hasita dagoen egiaztatzeko (Token bidez)
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Tokena lortu ("Bearer TOKEN_HEMEN" formatutik)
            token = req.headers.authorization.split(' ')[1];

            // Egiaztatu
            const decoded = jwt.verify(token, config.jwtSecret);

            // Erabiltzailea bilatu eta eskaerari (req) erantsi
            req.user = await User.findById(decoded.id).select('-password');
            next();

        } catch (error) {
            res.status(401).json({ success: false, message: 'Ez duzu baimenik, token baliogabea' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Ez duzu baimenik, tokena falta da' });
    }
};

// Admin dela egiaztatzeko
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};