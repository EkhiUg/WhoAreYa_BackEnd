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

        //Egiaztatu datu guztiak jaso direla
        if(!name || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Datu guztiak sartzea beharrezkoa da'
            });
        }

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

        //Tokena sortu
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: 'Erabiltzailea ondo erregistratu da',
            token,
            user: {
                id: user._id,
                name: user.name,
                lastNme: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message:'Errorea erregistroan', error:error.message });
    }
};

// @desc    Saioa hasi (Login)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Datuak egiaztatu
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Emaila eta pasahitza sartzea beharrezkoa da'
            });
        }

        // Erabiltzailea bilatu
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({
                 success: false,
                 message: 'Ez da erabiltzailea existitzen'
            });
        }

        // Erabiltzailea existitzen den eta pasahitza ondo dagoen egiaztatu
        const batDator = await user.matchPassword(password);
        if (!batDator) {
            return res.status(401).json({
                  success: false,
                  message: 'Pasahitza okerra da'
            });
        }

        //Tokena sortu
        const token = generateToken(user._id, user.role);

        res.status(200).json({
               success: true,
               message: 'Erabiltzailea ondo sartu da',
               token,
               user: {
                 id: user._id,
                 name: user.name,
                 lastName: user.lastName,
                 email: user.email,
                 role: user.role
                 }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Errorea login egitean', error: error.message });
    }
};

exports.logout = async (req, res) => {
      try {
         res.status(200).json({
             success: true,
             message: 'Saioa ondo itxi da'
         });
      }catch(error) {
         res.status(500).json({
            success: false,
            message: 'Errorea logout egitean',
            error: error.message
         });
      }
};