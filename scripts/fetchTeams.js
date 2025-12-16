const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

const downloadTeams = async () => {
    const readPath = path.join(__dirname, '../teamIDs.txt');
    const writePath = path.join(__dirname, '../public/images/teams/');

    try {
        await fsPromises.mkdir(writePath, { recursive: true });

        const content = await fsPromises.readFile(readPath, "utf8");
        const teamIds = content.split("\n");

        for (const idStr of teamIds) {
            const teamId = parseInt(idStr.trim());
            if (!teamId) continue;

            // FORMULA MAGIKOA [cite: 206-210]
            // Karpeta zenbakia kalkulatu: ID % 32
            const folder = teamId % 32;

            // URL-a osatu
            const url = `https://cdn.sportmonks.com/images/soccer/teams/${folder}/${teamId}.png`;
            const filePath = path.join(writePath, `${teamId}.png`);

            try {
                const res = await fetch(url);
                if (res.ok) {
                    const dest = fs.createWriteStream(filePath);
                    res.body.pipe(dest);
                    console.log(`✅ Taldea ${teamId} deskargatuta.`);
                } else {
                    console.log(`❌ Errorea ${teamId}: ${res.status}`);
                }
            } catch (err) {
                console.error(`Fetch errorea ${teamId}:`, err);
            }
        }

    } catch (err) {
        console.error('Errore orokorra:', err);
    }
};

downloadTeams();