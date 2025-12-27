const express = require('express');
const { getDb, saveDatabase } = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/tasks - Lista wszystkich zadań
router.get('/', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const isAdmin = req.user.user_type === 'admin';
        
        let query = `
            SELECT 
                t.*, 
                u.company_name, u.login
            FROM tasks t
            JOIN users u ON t.user_id = u.id
        `;

        // Klient widzi tylko swoje zadania
        if (!isAdmin) {
            query += ` WHERE t.user_id = ${req.user.id}`;
        }

        query += ` ORDER BY t.created_at DESC`;

        const result = db.exec(query);

        if (result.length === 0) {
            return res.json([]);
        }

        const columns = result[0].columns;
        const tasks = result[0].values.map(row => {
            const task = {};
            columns.forEach((col, idx) => {
                task[col] = row[idx];
            });
            return task;
        });

        res.json(tasks);
    } catch (error) {
        console.error('Błąd pobierania zadań:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// POST /api/tasks - Nowe zadanie
router.post('/', authenticateToken, (req, res) => {
    try {
        const db = getDb();
        const { title, description, priority } = req.body;
        const userId = req.user.user_type === 'admin' ? req.body.user_id : req.user.id;

        if (!title) {
            return res.status(400).json({ error: 'Tytuł zadania jest wymagany' });
        }

        db.run(
            'INSERT INTO tasks (user_id, title, description, priority, status) VALUES (?, ?, ?, ?, ?)',
            [userId, title, description, priority || 'normal', 'new']
        );

        saveDatabase();

        res.status(201).json({ message: 'Zadanie utworzone' });
    } catch (error) {
        console.error('Błąd tworzenia zadania:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// PUT /api/tasks/:id/status - Zmiana statusu zadania
router.put('/:id/status', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const { status } = req.body;
        const taskId = req.params.id;

        const validStatuses = ['new', 'in_progress', 'completed', 'archived', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Nieprawidłowy status' });
        }

        const updates = [status];
        let query = 'UPDATE tasks SET status = ?';

        if (status === 'completed') {
            query += ', completed_at = CURRENT_TIMESTAMP';
        }

        query += ' WHERE id = ?';
        updates.push(taskId);

        db.run(query, updates);
        saveDatabase();

        res.json({ message: 'Status zadania zaktualizowany' });
    } catch (error) {
        console.error('Błąd aktualizacji zadania:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// GET /api/tasks/emergency - Emergency zadania
router.get('/emergency', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        
        const result = db.exec(`
            SELECT 
                t.*, 
                u.company_name, u.login,
                b.amount, b.settlement_type
            FROM tasks t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN billing b ON t.id = b.task_id
            WHERE t.priority = 'emergency' AND t.status IN ('new', 'in_progress')
            ORDER BY t.created_at DESC
        `);

        if (result.length === 0) {
            return res.json([]);
        }

        const columns = result[0].columns;
        const emergencies = result[0].values.map(row => {
            const task = {};
            columns.forEach((col, idx) => {
                task[col] = row[idx];
            });
            return task;
        });

        res.json(emergencies);
    } catch (error) {
        console.error('Błąd pobierania emergency:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// POST /api/tasks/:id/emergency/settle - Rozliczenie Emergency
router.post('/:id/emergency/settle', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const { settlement_type } = req.body; // 'paid', 'visit_exchange', 'hours_exchange'
        const taskId = req.params.id;

        // Pobierz zadanie
        const taskResult = db.exec('SELECT user_id FROM tasks WHERE id = ?', [taskId]);
        if (taskResult.length === 0 || taskResult[0].values.length === 0) {
            return res.status(404).json({ error: 'Zadanie nie znalezione' });
        }

        const userId = taskResult[0].values[0][0];

        if (settlement_type === 'paid') {
            // Dodaj do rozliczeń
            db.run(
                'INSERT INTO billing (user_id, task_id, item_type, amount, settlement_type) VALUES (?, ?, ?, ?, ?)',
                [userId, taskId, 'emergency', 150, 'paid']
            );
        } else if (settlement_type === 'visit_exchange') {
            // Odejmij wizytę
            db.run('UPDATE subscriptions SET visits_used = visits_used + 1 WHERE user_id = ?', [userId]);
        } else if (settlement_type === 'hours_exchange') {
            // Odejmij 2 godziny
            db.run('UPDATE subscriptions SET hours_used = hours_used + 2 WHERE user_id = ?', [userId]);
        }

        // Zaktualizuj status zadania
        db.run('UPDATE tasks SET status = ? WHERE id = ?', ['completed', taskId]);

        // Log
        db.run('INSERT INTO security_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [req.user.id, 'EMERGENCY_SETTLE', `Rozliczenie Emergency ID:${taskId} jako ${settlement_type}`, req.ip]
        );

        saveDatabase();

        res.json({ message: 'Emergency rozliczone', settlement_type });
    } catch (error) {
        console.error('Błąd rozliczenia emergency:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// GET /api/tasks/archive - Lista archiwów miesięcznych
router.get('/archive', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        
        // Sprawdź czy tabela monthly_archives istnieje
        const tableCheck = db.exec(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='monthly_archives'
        `);
        
        if (tableCheck.length === 0) {
            return res.json({ years: [] });
        }
        
        // Pobierz lata
        const yearsResult = db.exec(`
            SELECT DISTINCT year 
            FROM monthly_archives 
            ORDER BY year DESC
        `);
        
        if (yearsResult.length === 0) {
            return res.json({ years: [] });
        }
        
        const years = yearsResult[0].values.map(row => row[0]);
        
        res.json({ years });
    } catch (error) {
        console.error('Błąd pobierania archiwum:', error);
        res.json({ years: [] });
    }
});

// GET /api/tasks/archive/:year - Miesiące dla roku
router.get('/archive/:year', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const year = parseInt(req.params.year);
        
        const result = db.exec(`
            SELECT DISTINCT month, 
                   COUNT(DISTINCT user_id) as clients_count,
                   SUM(tasks_count) as total_tasks,
                   SUM(revenue) as total_revenue
            FROM monthly_archives 
            WHERE year = ?
            GROUP BY month
            ORDER BY month DESC
        `, [year]);
        
        if (result.length === 0) {
            return res.json({ months: [] });
        }
        
        const columns = result[0].columns;
        const months = result[0].values.map(row => {
            const month = {};
            columns.forEach((col, idx) => {
                month[col] = row[idx];
            });
            return month;
        });
        
        res.json({ months });
    } catch (error) {
        console.error('Błąd pobierania miesięcy:', error);
        res.json({ months: [] });
    }
});

// GET /api/tasks/archive/:year/:month - Klienci dla miesiąca
router.get('/archive/:year/:month', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        
        const result = db.exec(`
            SELECT 
                user_id,
                client_name,
                tasks_count,
                visits_used,
                hours_used,
                revenue,
                package_name,
                created_at
            FROM monthly_archives 
            WHERE year = ? AND month = ?
            ORDER BY client_name
        `, [year, month]);
        
        if (result.length === 0) {
            return res.json({ clients: [] });
        }
        
        const columns = result[0].columns;
        const clients = result[0].values.map(row => {
            const client = {};
            columns.forEach((col, idx) => {
                client[col] = row[idx];
            });
            return client;
        });
        
        res.json({ clients });
    } catch (error) {
        console.error('Błąd pobierania klientów:', error);
        res.json({ clients: [] });
    }
});

// GET /api/tasks/archive/:year/:month/:userId - Szczegóły archiwum klienta
router.get('/archive/:year/:month/:userId', authenticateToken, requireAdmin, (req, res) => {
    try {
        const db = getDb();
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        const userId = parseInt(req.params.userId);
        
        const result = db.exec(`
            SELECT *
            FROM monthly_archives 
            WHERE year = ? AND month = ? AND user_id = ?
        `, [year, month, userId]);
        
        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({ error: 'Archiwum nie znalezione' });
        }
        
        const columns = result[0].columns;
        const values = result[0].values[0];
        const archive = {};
        columns.forEach((col, idx) => {
            archive[col] = values[idx];
        });
        
        // Parse archive_data JSON if exists
        if (archive.archive_data) {
            try {
                archive.details = JSON.parse(archive.archive_data);
            } catch (e) {
                archive.details = null;
            }
        }
        
        res.json(archive);
    } catch (error) {
        console.error('Błąd pobierania szczegółów archiwum:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

module.exports = router;
