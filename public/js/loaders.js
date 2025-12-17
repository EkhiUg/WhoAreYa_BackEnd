export { fetchJSON };

async function fetchJSON(what) {
    //YOUR CODE HERE
    const response = await fetch(`${what}.json`);
    if (!response.ok) {
        throw new Error(`Ezin da kargatu JSON fitxategia: ${what}`);
    }
    return await response.json();
}
