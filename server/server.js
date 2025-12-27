const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./database/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (frontend)
app.use(express.static('public'));

// Routes
const authRoutes = require('./routes/auth');
const clientsRoutes = require('./routes/clients');
const tasksRoutes = require('./routes/tasks');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Mobilna Asystentka API działa',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint nie istnieje' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
});

// Start server
async function start() {
    await initDatabase();
    
    app.listen(PORT, () => {
        console.log('╔══════════════════════════════════════════════╗');
        console.log('║   🚀 Mobilna Asystentka - System Backend   ║');
        console.log('╚══════════════════════════════════════════════╝');
        console.log(`✅ Serwer działa na porcie: ${PORT}`);
        console.log(`🌐 URL: http://localhost:${PORT}`);
        console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
        console.log('');
    });
}

start();

module.exports = app;
