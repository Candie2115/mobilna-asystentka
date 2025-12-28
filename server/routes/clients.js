const express = require('express');
const { getDb, saveDatabase } = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/clients/stats/summary - Statystyki (MUST BE BEFORE /:id)
router.get('/stats/summary', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();

        // Liczba aktywnych klientów
        const clientsResult = db.exec(`SELECT COUNT(*) as count FROM users WHERE user_type = 'client' AND status = 'active'`);
        const activeClients = clientsResult.length > 0 && clientsResult[0].values.length > 0 
            ? clientsResult[0].values[0][0] 
            : 0;

        // Suma przychodów
        const revenueResult = db.exec(`SELECT SUM(package_price) as total FROM subscriptions s JOIN users u ON s.user_id = u.id WHERE u.status = 'active'`);
        const totalRevenue = revenueResult.length > 0 && revenueResult[0].values.length > 0 
            ? (revenueResult[0].values[0][0] || 0)
            : 0;

        // Liczba zadań w tym miesiącu
        const tasksResult = db.exec(`SELECT COUNT(*) as count FROM tasks WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`);
        const monthlyTasks = tasksResult.length > 0 && tasksResult[0].values.length > 0
            ? tasksResult[0].values[0][0]
            : 0;

        res.json({
            activeClients,
            totalRevenue,
            monthlyTasks
        });
    } catch (error) {
        console.error('Błąd statystyk:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// GET /api/clients - Lista wszystkich klientów (admin) lub własne dane (klient)
router.get('/', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const isAdmin = req.user.user_type === 'admin';
        
        let query = `
            SELECT 
                u.id, u.login, u.email, u.company_name, u.status, u.created_at, u.package_type,
                s.package_name, s.package_price, s.visits_limit, s.visits_used, 
                s.hours_limit, s.hours_used, s.renewal_date
            FROM users u
            LEFT JOIN subscriptions s ON u.id = s.user_id
        `;
        
        if (isAdmin) {
            // Admin widzi wszystkich klientów
            query += ` WHERE u.user_type = 'client' ORDER BY u.created_at DESC`;
            var result = db.exec(query);
        } else {
            // Klient widzi tylko siebie
            query += ` WHERE u.id = ?`;
            var result = db.exec(query, [req.user.id]);
        }

        if (result.length === 0) {
            return res.json([]);
        }

        const columns = result[0].columns;
        const clients = result[0].values.map(row => {
            const client = {};
            columns.forEach((col, idx) => {
                client[col] = row[idx];
            });
            return client;
        });

        res.json(clients);
    } catch (error) {
        console.error('Błąd pobierania klientów:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// GET /api/clients/:id - Szczegóły klienta
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const clientId = req.params.id;

        const result = db.exec(`
            SELECT 
                u.*, 
                s.package_name, s.package_price, s.visits_limit, s.visits_used,
                s.hours_limit, s.hours_used, s.renewal_date
            FROM users u
            LEFT JOIN subscriptions s ON u.id = s.user_id
            WHERE u.id = ? AND u.user_type = 'client'
        `, [clientId]);

        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({ error: 'Klient nie znaleziony' });
        }

        const columns = result[0].columns;
        const values = result[0].values[0];
        const client = {};
        columns.forEach((col, idx) => {
            client[col] = values[idx];
        });

        res.json(client);
    } catch (error) {
        console.error('Błąd pobierania klienta:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// PUT /api/clients/:id/status - Zmiana statusu (active/memorium)
router.put('/:id/status', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const { status } = req.body;
        const clientId = req.params.id;

        if (!['active', 'memorium'].includes(status)) {
            return res.status(400).json({ error: 'Nieprawidłowy status' });
        }

        await db.run('UPDATE users SET status = ? WHERE id = ?', [status, clientId]);
        
        // Log
        await db.run('INSERT INTO security_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [req.user.id, 'STATUS_CHANGE', `Zmiana statusu klienta ${clientId} na ${status}`, req.ip]
        );
        
        saveDatabase();

        res.json({ message: 'Status zaktualizowany', status });
    } catch (error) {
        console.error('Błąd zmiany statusu:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// PUT /api/clients/:id/subscription - Aktualizacja liczników
router.put('/:id/subscription', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const { visits_used, hours_used } = req.body;
        const clientId = req.params.id;

        // Build update query based on provided fields
        const updates = [];
        const values = [];
        
        if (visits_used !== undefined) {
            updates.push('visits_used = ?');
            values.push(visits_used);
        }
        
        if (hours_used !== undefined) {
            updates.push('hours_used = ?');
            values.push(hours_used);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'Brak danych do aktualizacji' });
        }
        
        values.push(clientId);
        
        await db.run(`UPDATE subscriptions SET ${updates.join(', ')} WHERE user_id = ?`, values);

        saveDatabase();

        res.json({ message: 'Liczniki zaktualizowane' });
    } catch (error) {
        console.error('Błąd aktualizacji:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// DELETE /api/clients/:id - Usunięcie klienta
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const clientId = req.params.id;

        await db.run('DELETE FROM users WHERE id = ?', [clientId]);
        
        // Log
        await db.run('INSERT INTO security_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [req.user.id, 'CLIENT_DELETE', `Usunięto klienta ID: ${clientId}`, req.ip]
        );
        
        saveDatabase();

        res.json({ message: 'Klient usunięty' });
    } catch (error) {
        console.error('Błąd usuwania klienta:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

module.exports = router;
