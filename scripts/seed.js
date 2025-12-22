const mongoose = require('mongoose');
const connectDB = require('../src/config/database');

const Player = require('../src/models/player');
const Team = require('../src/models/team');
const League = require('../src/models/league');

const playersData = require('../FullPlayers.json');
const teamsData = require('../teams.json');
const leaguesData = require('../leagues.json');

const importData = async () => {
    await connectDB();

    try {
        await Player.deleteMany();
        await Team.deleteMany();
        await League.deleteMany();
        console.log('Aurreko datuak ezabatu dira');

        await League.insertMany(leaguesData);
        console.log('Ligak ondo inportatu dira');

        await Team.insertMany(teamsData);
        console.log('Taldeak ondo inportatu dira');

        await Player.insertMany(playersData);
        console.log('Jokalariak ondo inportatu dira');

        process.exit();
        
    } catch (error) {
        console.error(`Errorea inportazioan: ${error}`);
        process.exit(1);
    }
};

importData();