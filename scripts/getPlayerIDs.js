// scripts/getPlayerIDs.js
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../FullPlayers.json');
const outputFile = path.join(__dirname, '../playerIDs.txt');

try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const players = JSON.parse(rawData);

    // Jokalarien IDak atera
    // Hemen ez dugu Set behar, IDak bakarrak izan behar direlako berez,
    // baina segurtasunagatik iragazi dezakegu.
    const playerIds = players.map(p => p.id).sort((a, b) => a - b);

    // Gorde
    fs.writeFileSync(outputFile, playerIds.join('\n'));
    console.log(`✅ playerIDs.txt sortu da ${playerIds.length} jokalarirekin.`);

} catch (error) {
    console.error("Errorea:", error);
}