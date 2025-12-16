// scripts/getNationalities.js
const fs = require('fs');
const path = require('path');

// Bideak definitu
const inputFile = path.join(__dirname, '../FullPlayers.json');
const outputFile = path.join(__dirname, '../nationalities.txt');

try {
    // 1. JSON fitxategia irakurri
    if (!fs.existsSync(inputFile)) {
        console.error("❌ Ez da FullPlayers.json aurkitu proiektuaren erroan.");
        process.exit(1);
    }

    const rawData = fs.readFileSync(inputFile, 'utf8');
    const players = JSON.parse(rawData);

    // 2. Nazionalitateak atera eta errepikatuak kendu
    // 'Set' egiturak balio bakarrak gordetzen ditu automatikoki
    const nationalities = [...new Set(players.map(p => p.nationality))];

    // 3. Ordenatu (aukerazkoa baina txukunagoa)
    nationalities.sort();

    // 4. Fitxategian idatzi (lerro bakoitzean bat)
    fs.writeFileSync(outputFile, nationalities.join('\n'));

    console.log(`✅ nationalities.txt sortu da ${nationalities.length} herrialderekin.`);

} catch (error) {
    console.error("Errorea:", error);
}