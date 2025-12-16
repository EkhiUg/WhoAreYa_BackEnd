// scripts/getTeamIDs.js
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../FullPlayers.json');
const outputFile = path.join(__dirname, '../teamIDs.txt');

try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const players = JSON.parse(rawData);

    // 1. IDak atera eta bikoiztuak kendu (Set erabiliz)
    // Zenbakiak direla ziurtatu dugu
    const teamIds = [...new Set(players.map(p => p.teamId))];

    // 2. Zenbakizko ordenean jarri (txikitik handira) [cite: 219]
    teamIds.sort((a, b) => a - b);

    // 3. Fitxategian gorde
    fs.writeFileSync(outputFile, teamIds.join('\n'));

    console.log(`✅ teamIDs.txt sortu da ${teamIds.length} talde IDrekin.`);

} catch (error) {
    console.error("Errorea:", error);
}