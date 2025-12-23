require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./src/config'); // Konfigurazio zentralizatua
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/adminRoutes');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());





connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware
app.use(cors());

app.use(express.static('public')); // Irudi estatikoak zerbitzatzeko
app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);

// Ibilbideak (Routes) - Aurrerago beteko dira
// app.use('/api/players', require('./src/routes/players'));

// Zerbitzaria abiarazi
app.listen(config.port, '0.0.0.0', () => {
    console.log(`Zerbitzaria martxan portu honetan: ${config.port}`);
});
