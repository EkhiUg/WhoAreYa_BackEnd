const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/whoareya');
        
        console.log(`MongoDB-ra konektatuta: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Errorea konexioa ezartzerakoan: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;