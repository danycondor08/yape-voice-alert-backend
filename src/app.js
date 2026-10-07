const express = require('express');
const cors = require('cors');
const yapeRoutes = require('./routes/yapeRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Rutas principales
app.use('/api/yape', yapeRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'success', message: 'YapeVoiceAlert API Backend Activa 🚀' });
});

module.exports = app;