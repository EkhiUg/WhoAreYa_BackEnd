const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

// Tokena sortzeko funtzio laguntzailea
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, config.jwtSecret, {
        expiresIn: '30d' // Tokenak 30 egun iraungo du
    });
};

// @desc    Erabiltzaile berria erregistratu
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, lastName, email, password } = req.body;

        // Egiaztatu ea existitzen den
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email hori erregistratuta dago jada.' });
        }

        // Lehenengo erabiltzailea bada -> ADMIN, bestela -> USER
        const isFirstAccount = (await User.countDocuments({})) === 0;
        const role = isFirstAccount ? 'admin' : 'user';

        // Erabiltzailea sortu
        const user = await User.create({
            name,
            lastName,
            email,
            password,
            role
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id, user.role),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Saioa hasi (Login)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Erabiltzailea bilatu
        const user = await User.findOne({ email });

        // Erabiltzailea existitzen den eta pasahitza ondo dagoen egiaztatu
        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                token: generateToken(user._id, user.role),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Kredentzial baliogabeak' });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};