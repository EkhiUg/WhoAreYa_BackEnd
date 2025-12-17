import { folder, leftArrow, higher, lower, stringToHTML } from "./fragments.js";

// rows.js fitxategiaren hasieran:

import { initState, updateStats } from './stats.js'; // <--- updateStats GEHITU HEMEN
import { stats, headless, toggle } from './fragments.js';

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate'];

export function getPlayer(game, playerId) {
    let jokalaria = game.players.find(j => j.id === playerId);

    if (!jokalaria) {
        console.log("Ez da jokalaririk aurkitu zehaztutako ID-arekin!");
        return null;
    } else {
        console.log("Jokalaria aurkitu da!");
        return jokalaria;
    }
}

export function setupRows(game) {

    // ⭐ M4: initState gehitua
    let [state, updateState] = initState('WAYgameState', game.solution.id);
    // Game objektua sinkronizatu
    game.guesses = state.guesses;
    
    function leagueToFlag(leagueId) {
        let map = {
            564: "es1",
            8: "en1",
            82: "de1",
            384: "it1",
            301: "fr1"
        };
        return map[leagueId] || "Ez da ezagutzen liga.";
    }

    function getAge(dateString) {
        let gaur = new Date();
        let urtebetetzea = new Date(dateString);
        let adina = gaur.getFullYear() - urtebetetzea.getFullYear();

        let hilabeteak = gaur.getMonth() - urtebetetzea.getMonth();
        let egunak = gaur.getDate() - urtebetetzea.getDate();

        if (hilabeteak < 0 || (hilabeteak === 0 && egunak < 0)) {
            adina--;
        }
        return adina;
    }

    function check(theKey, theValue) {
        let jokalariMisteriotsua = game.solution;

        if (theKey === "birthdate") {
            let misterAge = getAge(jokalariMisteriotsua.birthDate);
            let guessAge = getAge(theValue);

            if (misterAge === guessAge) return "correct";
            if (guessAge < misterAge) return "lower";
            return "higher";
        }

        return (jokalariMisteriotsua[theKey] === theValue) ? "correct" : "incorrect";
    }

    // ⭐ M4: UNBLUR FUNTZIOA TXERTATUA [cite: 499]
    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                const combo = document.getElementById("combobox");
                if (combo) combo.remove();
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }

    function showStats(timeout) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.body.appendChild(stringToHTML(headless(stats())));
                document.getElementById("showHide").onclick = toggle;
                bindClose();
                resolve();
            }, timeout)
        })
    }

    function bindClose() {
        document.getElementById("closedialog").onclick = function () {
            document.body.removeChild(document.body.lastChild)
            document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
        }
    }

    // ⭐ M4: success eta gameOver funtzioak unblur erabiltzeko [cite: 500, 501]
    function success() {
        unblur('success');
        showStats(2500);
    }

    function gameOver() {
        unblur('gameOver');
        showStats(2500);
    }

    // ⭐ M4: resetInput eguneratua placeholder-a aldatzeko
    function resetInput() {
        let input = document.getElementById("myInput");
        if (!input) return;

        input.value = "";

        // "Guess X of 8" kalkulatu
        let nextGuess = game.guesses.length + 1;
        if(nextGuess <= 8) {
            input.placeholder = "Guess " + nextGuess + " of 8";
        } else {
            input.placeholder = "Game Over"; // Edo hutsik utzi
        }

        input.focus();
    }

    // ⭐ M4: gameEnded
    function gameEnded(lastGuess) {
        if (lastGuess === game.solution.id) return true;
        if (game.guesses.length >= 8) return true;
        return false;
    }

    function setContent(guess) {
        let age = getAge(guess.birthdate);
        let ageStatus = check("birthdate", guess.birthdate);
        let ageIcon =
            ageStatus === "higher" ? higher :
                ageStatus === "lower" ? lower : "";

        return [
            `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" style="width: 60%;">`,
            `${guess.position}`,
            `${age}${ageIcon}`
        ];
    }

    function showContent(content, guess) {
        let fragments = "";

        for (let j = 0; j < content.length; j++) {
            const delayMs = `${(j + 1) * delay}ms`;

            fragments += `
                <div class="w-1/5 shrink-0 flex justify-center ">
                    <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square 
                                rounded-full justify-center items-center bg-slate-400 text-white
                                ${check(attribs[j], guess[attribs[j]]) === 'correct' ? 'bg-green-500' : ''}
                                opacity-0 fadeInDown"
                         style="max-width: 60px; animation-delay: ${delayMs};">
                        ${content[j]}
                    </div>
                </div>`;
        }

        const child = `
            <div class="flex w-full flex-wrap text-l py-2">
                <div class="w-full grow text-center pb-2">
                    <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4
                                uppercase font-bold text-lg opacity-0 fadeInDown"
                         style="animation-delay: 0ms;">
                        ${guess.name}
                    </div>
                </div>
                ${fragments}
            </div>`;

        document.getElementById('players').prepend(stringToHTML(child));
    }

    // Hasieran inputa prestatu
    resetInput();

    let tick = function () {
        let now = new Date();
        let tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0); // Hurrengo gauerdia

        let diff = tomorrow - now; // Diferentzia milisegundotan

        // Kalkulatu orduak, minutuak eta segunduak
        let hours = Math.floor(diff / (1000 * 60 * 60));
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Formateatu (09:05:01 itxura izateko)
        let h = hours.toString().padStart(2, "0");
        let m = minutes.toString().padStart(2, "0");
        let s = seconds.toString().padStart(2, "0");

        // HTML-a eguneratu
        let element = document.getElementById("nextPlayer");
        if (element) {
            element.innerHTML = `${h}:${m}:${s}`;
        }
    };
    // Itzuliko den funtzioa (main.js-ko addRow)
    return function addRow(playerId) {

        let guess = getPlayer(game, playerId);
        if (!guess) return;

        let content = setContent(guess);

        // ⭐ M4 — Estatistikak gordetzen dira
        // Ziurtatu ez dugula bikoizten (updateState-k ere gehitzen du batzuetan inplementazioaren arabera,
        // baina hemen seguru jokatzeko arraya eta localStorage sinkronizatzen dira)
        
        if (!game.guesses.includes(playerId)) {
            updateState(playerId);
        }

        // Inputa garbitu eta placeholder eguneratu
        resetInput();

        if (gameEnded(playerId)) {
             updateStats(game.guesses.length);

            if (playerId === game.solution.id) {
                success();
            }

            if (game.guesses.length >= 8) {
                gameOver();
            }
            let interval = setInterval(tick, 1000);

        }


        showContent(content, guess)

    };
}