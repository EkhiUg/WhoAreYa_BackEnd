/**
 * stats.js
 * Milestone 4: initState (what, solutionId)
 */

export function initState(what, solutionId) {

    // 1. LocalStorage-tik saioa irakurri
    let jsonState = localStorage.getItem(what);
    let state;

    // 2. Dagoeneko badago objektua gordeta → hartu
    if (jsonState) {
        state = JSON.parse(jsonState);
    }

    // 3. Bestela, objektu berria sortu
    if (!state) {
        state = {
            guesses: [],        // hutsik
            solution: solutionId // M4: solutionId ere gorde
        };

        localStorage.setItem(what, JSON.stringify(state));
    }

    // 4. Funtzio anonimoa: guess gehitzen du
    function updateState(guess) {
        state.guesses.push(guess);               // saiakera gehitu
        localStorage.setItem(what, JSON.stringify(state)); // gordetu
    }

    // 5. Itzuli: [state, funtzioa]
    return [state, updateState];
}

// 1. ARIKETA: Ehunekoa kalkulatu [cite: 510, 536]
function successRate (e){
    // Partida kopurua 0 bada, ehunekoa 0 da (zatiketa 0z ekiditeko)
    if (e.totalGames === 0) {
        return 0;
    }

    // Asmatutako partidak = Totala - Huts egindakoak
    let wins = e.totalGames - e.gamesFailed;

    // Kalkulua: (Irabaziak / Totala) * 100. Math.round erabiltzen da hamartarrik gabe uzteko.
    return Math.round((wins / e.totalGames) * 100);
}

export let getStats = function(what) {
    // 1. LocalStorage-tik irakurri
    let jsonStats = localStorage.getItem(what);

    // 2. Existitzen bada, JSON parseatu eta itzuli
    if (jsonStats) {
        return JSON.parse(jsonStats);
    }

    // 3. Ez bada existitzen, objektu berria sortu PDFko egiturarekin
    let newStats = {
        winDistribution: [0,0,0,0,0,0,0,0,0], // 9 posizio
        gamesFailed: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalGames: 0,
        successRate: 0
    };

    // 4. LocalStorage-n gorde etorkizunerako
    localStorage.setItem(what, JSON.stringify(newStats));

    // 5. Objektu berria itzuli
    return newStats;
};


// 3. ARIKETA: Estatistikak eguneratu jokoa amaitzean
export function updateStats(t) {
    // 1. Partida totalen kopurua igo
    gamestats.totalGames++;

    // 2. Irabazi edo Galdu den egiaztatu
    // PDFak dio: t < 8 bada asmatu da, t >= 8 bada ez da asmatu
    if (t < 8) {
        // --- IRABAZI ---

        // Uneko bolada (currentStreak) handitu
        gamestats.currentStreak++;

        // Banaketa (winDistribution) eguneratu
        // 't' 0tik hasten den indizea denez (0 = 1. saiakera),
        // t+1 posizioa eguneratzen dugu.
        // Adibidez: t=0 (1. saiakera) -> winDistribution[1] igotzen da.
        if (gamestats.winDistribution[t + 1] !== undefined) {
            gamestats.winDistribution[t + 1]++;
        }

        // Bolada onena (bestStreak) gainditu den egiaztatu
        if (gamestats.currentStreak > gamestats.bestStreak) {
            gamestats.bestStreak = gamestats.currentStreak;
        }

    } else {
        // --- GALDU ---

        // Galdutako partidak igo
        gamestats.gamesFailed++;

        // Uneko bolada zerora bueltatu
        gamestats.currentStreak = 0;
    }

    // 3. Asmatze-tasa (successRate) birkalkulatu
    // Lehen sortu dugun funtzioa berrerabiltzen dugu
    gamestats.successRate = successRate(gamestats);

    // 4. Datu berriak LocalStorage-n gorde "gameStats" izenarekin
    localStorage.setItem('gameStats', JSON.stringify(gamestats));
}


let gamestats = getStats('gameStats');

