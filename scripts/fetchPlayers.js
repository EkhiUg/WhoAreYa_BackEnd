const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const pLimit = require('p-limit');

// Muga 5era jaitsi dugu blokeoak saihesteko
const CONCURRENCY_LIMIT = 5;

const downloadPlayers = async () => {
    const readPath = path.join(__dirname, '../playerIDs.txt');
    const writePath = path.join(__dirname, '../public/images/players/');
    const limit = pLimit(CONCURRENCY_LIMIT);

    try {
        await fsPromises.mkdir(writePath, { recursive: true });

        const content = await fsPromises.readFile(readPath, "utf8");
        const playerIds = content.split("\n").map(line => line.trim()).filter(line => line.length > 0);

        console.log(` ${playerIds.length} jokalari deskargatzen (Headers + Muga: ${CONCURRENCY_LIMIT})...`);

        const downloadPromises = playerIds.map(idStr => {
            return limit(async () => {
                const playerId = parseInt(idStr);
                const folder = playerId % 32;
                const url = `https://playfootball.games/media/players/${folder}/${playerId}.png`;
                const filePath = path.join(writePath, `${playerId}.png`);

                if (fs.existsSync(filePath)) return;

                try {
                    // Headers objektua gehituta:
                    const res = await fetch(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Referer': 'https://playfootball.games/',
                            'Accept': 'image/*'
                        }
                    });

                    if (res.ok) {
                        const dest = fs.createWriteStream(filePath);
                        res.body.pipe(dest);
                        // Aukerazkoa: log gutxiago ikusteko
                        // console.log(`✅ ${playerId}`);
                    } else {
                        // 404 bada, irudia ez da existitzen (normala izan daiteke batzuetan)
                        // 403 bada, oraindik blokeatzen gaitu
                        console.log(`❌ Errorea ${playerId}: ${res.status}`);
                    }
                } catch (err) {
                    console.error(`Fetch errorea ${playerId}:`, err);
                }
            });
        });

        await Promise.all(downloadPromises);
        console.log(" Prozesua amaituta!");

    } catch (err) {
        console.error('Errore orokorra:', err);
    }
};

downloadPlayers();