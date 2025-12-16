const mongoose = require('mongoose');
const connectDB = require('./src/config/database');

const Player = require('./src/models/player');

const playersData = require('./FullPlayers.json'); 

const importData = async () => {
    await connectDB();

    try {
        await Player.deleteMany();
        console.log('Aurreko datuak ezabatu dira');

        await Player.insertMany(playersData);
        
        console.log('Jokalariak ondo inportatu dira');
        process.exit();
        
    } catch (error) {
        console.error(`Errorea inportazioan: ${error}`);
        process.exit(1);
    }
};

importData();