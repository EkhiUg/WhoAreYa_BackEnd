require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./src/config'); // Konfigurazio zentralizatua

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Irudi estatikoak zerbitzatzeko

// Ibilbideak (Routes) - Aurrerago beteko dira
// app.use('/api/players', require('./src/routes/players'));

// Zerbitzaria abiarazi
app.listen(config.port, () => {
    console.log(`Zerbitzaria martxan portu honetan: ${config.port}`);
});