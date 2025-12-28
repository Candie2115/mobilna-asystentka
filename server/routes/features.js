const express = require('express');
const router = express.Router();
const { getDb, saveDatabase } = require('../database/db');

// ===== TASK MANAGER =====
router.get('/tasks/:clientId', (req, res) => {
    const db = getDb();
    const result = db.exec(`SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`, [req.params.clientId]);
    res.json(result[0]?.values || []);
});

router.post('/tasks', (req, res) => {
    const { clientId, title, description, priority } = req.body;
    const db = getDb();
    await db.run(`INSERT INTO tasks (user_id, title, description, status, priority) VALUES (?, ?, ?, 'pending', ?)`, 
        [clientId, title, description || '', priority || 'normal']);
    saveDatabase();
    res.json({ success: true });
});

router.put('/tasks/:taskId', (req, res) => {
    const { status } = req.body;
    const db = getDb();
    await db.run(`UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
        [status, req.params.taskId]);
    saveDatabase();
    res.json({ success: true });
});

router.delete('/tasks/:taskId', (req, res) => {
    const db = getDb();
    await db.run(`DELETE FROM tasks WHERE id = ?`, [req.params.taskId]);
    saveDatabase();
    res.json({ success: true });
});

// ===== DIRECT CHAT =====
router.get('/chat/:clientId', (req, res) => {
    const db = getDb();
    const result = db.exec(`
        SELECT id, client_id, sender, message, created_at 
        FROM chat_messages 
        WHERE client_id = ? 
        ORDER BY created_at ASC
    `, [req.params.clientId]);
    
    const messages = (result[0]?.values || []).map(row => ({
        id: row[0],
        clientId: row[1],
        sender: row[2],
        message: row[3],
        createdAt: row[4]
    }));
    
    res.json(messages);
});

router.post('/chat', (req, res) => {
    const { clientId, sender, message } = req.body;
    const db = getDb();
    await db.run(`INSERT INTO chat_messages (client_id, sender, message) VALUES (?, ?, ?)`, 
        [clientId, sender, message]);
    saveDatabase();
    res.json({ success: true });
});

// ===== FAKTURY/ROZLICZENIA =====
router.get('/invoices/:clientId', (req, res) => {
    const db = getDb();
    const result = db.exec(`
        SELECT id, client_id, invoice_number, amount, status, created_at 
        FROM invoices 
        WHERE client_id = ? 
        ORDER BY created_at DESC
    `, [req.params.clientId]);
    
    const invoices = (result[0]?.values || []).map(row => ({
        id: row[0],
        clientId: row[1],
        invoiceNumber: row[2],
        amount: row[3],
        status: row[4],
        createdAt: row[5]
    }));
    
    res.json(invoices);
});

router.post('/invoices', (req, res) => {
    const { clientId, amount } = req.body;
    const invoiceNumber = `FV/${new Date().getFullYear()}/${Math.floor(Math.random() * 9000 + 1000)}`;
    const db = getDb();
    await db.run(`INSERT INTO invoices (client_id, invoice_number, amount, status) VALUES (?, ?, ?, 'PROFORMA')`, 
        [clientId, invoiceNumber, amount || 0]);
    saveDatabase();
    res.json({ success: true, invoiceNumber });
});

router.put('/invoices/:invoiceId', (req, res) => {
    const { status } = req.body;
    const db = getDb();
    await db.run(`UPDATE invoices SET status = ? WHERE id = ?`, [status, req.params.invoiceId]);
    saveDatabase();
    res.json({ success: true });
});

// ===== KALENDARZ WSPÓŁPRACY =====
router.get('/calendar/:clientId', (req, res) => {
    const db = getDb();
    const result = db.exec(`
        SELECT id, client_id, event_date, event_title, created_at 
        FROM calendar_events 
        WHERE client_id = ? 
        ORDER BY event_date ASC
    `, [req.params.clientId]);
    
    const events = (result[0]?.values || []).map(row => ({
        id: row[0],
        clientId: row[1],
        eventDate: row[2],
        eventTitle: row[3],
        createdAt: row[4]
    }));
    
    res.json(events);
});

router.post('/calendar', (req, res) => {
    const { clientId, eventDate, eventTitle } = req.body;
    const db = getDb();
    await db.run(`INSERT INTO calendar_events (client_id, event_date, event_title) VALUES (?, ?, ?)`, 
        [clientId, eventDate, eventTitle || '']);
    saveDatabase();
    res.json({ success: true });
});

router.delete('/calendar/:eventId', (req, res) => {
    const db = getDb();
    await db.run(`DELETE FROM calendar_events WHERE id = ?`, [req.params.eventId]);
    saveDatabase();
    res.json({ success: true });
});

// ===== SYSTEM LOGS (tylko admin) =====
router.post('/logs', (req, res) => {
    const { action, details } = req.body;
    const db = getDb();
    await db.run(`INSERT INTO system_logs (action, details) VALUES (?, ?)`, [action, details || '']);
    saveDatabase();
    res.json({ success: true });
});

router.get('/logs', (req, res) => {
    const db = getDb();
    const result = db.exec(`SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 50`);
    
    const logs = (result[0]?.values || []).map(row => ({
        id: row[0],
        action: row[1],
        details: row[2],
        createdAt: row[3]
    }));
    
    res.json(logs);
});

// ===== ARCHIWUM MIESIĘCZNE =====
router.post('/archive', (req, res) => {
    const { clientId, month, year } = req.body;
    const db = getDb();
    await db.run(`INSERT INTO monthly_archive (client_id, archive_month, archive_year) VALUES (?, ?, ?)`, 
        [clientId, month, year]);
    saveDatabase();
    res.json({ success: true });
});

router.get('/archive', (req, res) => {
    const db = getDb();
    const result = db.exec(`
        SELECT ma.id, u.username, ma.archive_month, ma.archive_year, ma.created_at
        FROM monthly_archive ma
        JOIN users u ON ma.client_id = u.id
        ORDER BY ma.archive_year DESC, ma.archive_month DESC
    `);
    
    const archives = (result[0]?.values || []).map(row => ({
        id: row[0],
        clientName: row[1],
        month: row[2],
        year: row[3],
        createdAt: row[4]
    }));
    
    res.json(archives);
});

// ===== MEMORIUM (dezaktywowani) =====
router.post('/memorium/:clientId', (req, res) => {
    const db = getDb();
    await db.run(`UPDATE users SET status = 'deactivated', deactivated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
        [req.params.clientId]);
    saveDatabase();
    res.json({ success: true });
});

router.post('/memorium/reactivate/:clientId', (req, res) => {
    const db = getDb();
    await db.run(`UPDATE users SET status = 'active', deactivated_at = NULL WHERE id = ?`, 
        [req.params.clientId]);
    saveDatabase();
    res.json({ success: true });
});

router.get('/memorium', (req, res) => {
    const db = getDb();
    const result = db.exec(`SELECT * FROM users WHERE status = 'deactivated' ORDER BY deactivated_at DESC`);
    
    const deactivated = (result[0]?.values || []).map(row => ({
        id: row[0],
        username: row[1],
        email: row[2],
        package: row[4],
        deactivatedAt: row[13]
    }));
    
    res.json(deactivated);
});

// ===== EMERGENCY WYMIANA =====
router.post('/emergency/exchange', (req, res) => {
    const { clientId, exchangeType } = req.body; // 'visit' or 'hours'
    const db = getDb();
    
    // Usuń jedną interwencję emergency
    const emergencyResult = db.exec(`SELECT id FROM tasks WHERE user_id = ? AND priority = 'emergency' LIMIT 1`, [clientId]);
    
    if (emergencyResult[0]?.values?.length > 0) {
        const emergencyId = emergencyResult[0].values[0][0];
        await db.run(`DELETE FROM tasks WHERE id = ?`, [emergencyId]);
        
        // Odejmij zasoby
        const clientResult = db.exec(`SELECT username FROM users WHERE id = ?`, [clientId]);
        if (clientResult[0]?.values?.length > 0) {
            // Tu możesz dodać logikę odejmowania wizyt/godzin
            // Wymaga rozszerzenia tabeli clients o kolumny visits/hours
        }
        
        saveDatabase();
        res.json({ success: true, message: `Wymieniono emergency na ${exchangeType}` });
    } else {
        res.status(400).json({ error: 'Brak interwencji emergency do wymiany' });
    }
});

module.exports = router;
