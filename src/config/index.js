require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/whoareya',
    jwtSecret: process.env.JWT_SECRET || 'nire_sekretu_super_zaila'
};

module.exports = config;