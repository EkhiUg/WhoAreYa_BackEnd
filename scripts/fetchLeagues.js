const fs = require('fs'); // Stream-etarako (createWriteStream)
const fsPromises = require('fs').promises; // Async/await erabiltzeko (mkdir, readFile)
const path = require('path');
const fetch = require('node-fetch');


const downloadLeagues = async () => {

    const writepath = path.join(__dirname, '../public/images/leagues/');

    try {
        // 2. Karpeta sortu (existitzen ez bada)
        await fsPromises.mkdir(writepath, { recursive: true });

        // 3. Fitxategia irakurri
        const content = await fsPromises.readFile("leagues.txt", "utf8");

        // Lerroz lerro banatu
        const data = content.split("\n");

        // 4. Liga bakoitzeko begizta
        data.forEach((elem, idx) => {
            // Segurtasuna: lerro hutsak eta espazioak garbitu (.trim())
            // Hau oso garrantzitsua da Windows eta Linux arteko bateragarritasunerako (\r karaktereak kentzeko)
            const cleanElem = elem.trim();
            if (!cleanElem) return;

            // URL-a osatu
            const url = `https://playfootball.games/media/competitions/${cleanElem}.png`;

            // Eskaera egin
            fetch(url)
                .then(res => {
                    // Egoera egiaztatu (200 OK)
                    if (res.status === 200) {
                        // Dokumentuan aipatzen den 'pipe' metodoa erabili [cite: 780]
                        const dest = fs.createWriteStream(path.join(writepath, `${cleanElem}.png`));
                        res.body.pipe(dest);
                        console.log(`✅ ${cleanElem}.png gordeta.`);
                    } else {
                        console.log(`❌ Errorea: status: ${res.status} line: ${idx} elem: ${cleanElem} not found`);
                    }
                })
                .catch(err => console.log('Fetch errorea:', err));
        });

    } catch (err) {
        console.error('Fitxategi errorea:', err);
    }
};

// Funtzioa exekutatu
downloadLeagues();