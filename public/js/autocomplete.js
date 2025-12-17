import { setupRows } from "./rows.js";

export { autocomplete };

function autocomplete(inp, game) {
    const addRow = setupRows(game);
    const players = game.players;
    let currentFocus;

    inp.addEventListener("input", function () {
        const val = this.value;
        console.log("Input value:", val);
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;

        const combobox = inp.closest('[role="combobox"]');
        const a = document.createElement("DIV");
        a.setAttribute("class", "autocomplete-items");
        a.style.position = "absolute";
        a.style.top = "100%";
        a.style.left = "0";
        a.style.right = "0";
        a.style.backgroundColor = "white";
        a.style.zIndex = "1000";
       combobox.appendChild(a);

        players.forEach(player => {
            if (player.name.toUpperCase().includes(val.toUpperCase())) {
                const b = document.createElement("DIV");
                b.classList.add('flex', 'items-start', 'gap-x-3', 'leading-tight', 'uppercase', 'text-sm');


                // beltzezko nabarmendua
                const name = player.name;
                const index = name.toUpperCase().indexOf(val.toUpperCase());
                const beltzez =
                    name.substring(0, index) +
                    "<span class='font-bold'>" +
                    name.substring(index, index + val.length) +
                    "</span>" +
                    name.substring(index + val.length);

                b.innerHTML = `<img src="https://cdn.sportmonks.com/images/soccer/teams/${player.teamId % 32}/${player.teamId}.png" width="28" height="28">
                                <span class='self-center'>${beltzez}</span>
                                    <input type='hidden' name='id' value='${player.id}'>
                                `;

                // click listener
                b.addEventListener("click", function () {
                    inp.value = player.name;
                    closeAllLists();
                    addRow(player.id);
                });

                a.appendChild(b);
            }
        });
    });

    inp.addEventListener("keydown", function (e) {
        let x = inp.closest('[role="combobox"]').querySelector(".autocomplete-items");
        if (x) x = x.getElementsByTagName("div");
        if (!x) return;

        if (e.keyCode === 40) { // down
            currentFocus++;
            addActive(x);
        } else if (e.keyCode === 38) { // up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode === 13) { // enter
            e.preventDefault();
            if (currentFocus > -1) x[currentFocus].click();
        }
    });

    function addActive(x) {
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        x[currentFocus].classList.add("autocomplete-active", "bg-slate-200", "pointer");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active", "bg-slate-200", "pointer");
        }
    }

    function closeAllLists(elmnt) {
        const x = document.querySelectorAll(".autocomplete-items");
        x.forEach(item => {
            if(elmnt !== item && elmnt !== inp) {
                if (item.parentNode) item.parentNode.removeChild(item);
            }
        });
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
