const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

const downloadFlags = async () => {
    // 1. Bideak definitu
    const readPath = path.join(__dirname, '../nationalities.txt');
    const writePath = path.join(__dirname, '../public/images/nations/');

    try {
        // Karpeta sortu
        await fsPromises.mkdir(writePath, { recursive: true });

        // Fitxategia irakurri
        const content = await fsPromises.readFile(readPath, "utf8");
        const nations = content.split("\n");

        for (const nation of nations) {
            const cleanNation = nation.trim();
            if (!cleanNation) continue;

            // 2. URL Encoding: Espazioak eta karaktere bereziak kudeatu [cite: 196]
            // encodeURIComponent funtzioak espazioak %20 bihurtzen ditu automatikoki
            const encodedNation = encodeURIComponent(cleanNation);

            // Banderak .svg formatuan daude [cite: 191]
            const url = `https://playfootball.games/media/nations/${encodedNation}.svg`;

            // Fitxategiaren izena jatorrizkoa mantenduko dugu diskorako
            const filePath = path.join(writePath, `${cleanNation}.svg`);

            try {
                const res = await fetch(url);
                if (res.ok) {
                    const dest = fs.createWriteStream(filePath);
                    res.body.pipe(dest);
                    console.log(`✅ ${cleanNation} deskargatuta.`);
                } else {
                    console.log(`❌ Ez da aurkitu: ${cleanNation} (Status: ${res.status})`);
                }
            } catch (err) {
                console.error(`Errorea ${cleanNation} deskargatzean:`, err);
            }
        }

    } catch (err) {
        console.error('Errore orokorra:', err);
    }
};

downloadFlags();