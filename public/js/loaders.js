export { fetchJSON, fetchPlayer, fetchSolution };

const API_URL = 'http://localhost:3000/api';

async function fetchJSON(what) {
     let endpoint;
     if (what === 'fullplayers25') {
        endpoint = `${API_URL}/players`;
     } else if (what === 'solution25') {
        endpoint = `${API_URL}/solution/${difference_In_Days}`;
     }
     const response = await fetch(endpoint);
     if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
     }
     return await response.json();
}

async function fetchPlayer(playerId) {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    return await response.json();
}

async function fetchSolution(gameNumber) {
    const response = await fetch(`${API_URL}/solution/${gameNumber}`);
    return await response.json();
}


