const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDb, saveDatabase } = require('../database/db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Logowanie
router.post('/login', [
    body('login').notEmpty().withMessage('Login jest wymagany'),
    body('password').notEmpty().withMessage('Hasło jest wymagane')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;

    try {
        const db = getDb();
        
        // Pobierz użytkownika z bazy
        const result = db.exec('SELECT * FROM users WHERE login = ?', [login]);
        
        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
        }

        const columns = result[0].columns;
        const values = result[0].values[0];
        const user = {};
        columns.forEach((col, idx) => {
            user[col] = values[idx];
        });

        // Sprawdź status konta
        if (user.status === 'memorium') {
            return res.status(403).json({ 
                error: 'Konto zostało dezaktywowane (Memorium). Skontaktuj się z administratorem.' 
            });
        }

        // Weryfikuj hasło
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
        }

        // Generuj token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                login: user.login, 
                user_type: user.user_type,
                status: user.status
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log bezpieczeństwa
        db.run('INSERT INTO security_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [user.id, 'LOGIN_SUCCESS', `Użytkownik ${user.login} zalogował się pomyślnie`, req.ip]
        );
        saveDatabase();

        res.json({
            message: 'Logowanie pomyślne',
            token,
            user: {
                id: user.id,
                login: user.login,
                email: user.email,
                user_type: user.user_type,
                company_name: user.company_name
            }
        });

    } catch (error) {
        console.error('Błąd logowania:', error);
        res.status(500).json({ error: 'Błąd serwera podczas logowania' });
    }
});

// POST /api/auth/register - Rejestracja (wniosek)
router.post('/register', [
    body('login').notEmpty().isLength({ min: 3 }).withMessage('Login musi mieć min. 3 znaki'),
    body('email').isEmail().withMessage('Nieprawidłowy adres email'),
    body('password').isLength({ min: 6 }).withMessage('Hasło musi mieć min. 6 znaków'),
    body('company_name').notEmpty().withMessage('Nazwa firmy jest wymagana'),
    body('package').notEmpty().withMessage('Wybierz pakiet')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { login, email, password, company_name, package: packageName } = req.body;

    try {
        const db = getDb();
        
        // Sprawdź czy login/email już istnieją
        const existing = db.exec('SELECT * FROM users WHERE login = ? OR email = ?', [login, email]);

        if (existing.length > 0 && existing[0].values.length > 0) {
            return res.status(409).json({ error: 'Login lub email już istnieje' });
        }

        // Hash hasła
        const passwordHash = await bcrypt.hash(password, 10);

        // Dodaj użytkownika z przypisanym pakietem
        db.run('INSERT INTO users (login, email, password_hash, user_type, company_name, status, package_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [login, email, passwordHash, 'client', company_name, 'active', packageName]
        );

        const userResult = db.exec('SELECT id FROM users WHERE login = ?', [login]);
        const userId = userResult[0].values[0][0];

        // Przypisz pakiet
        const packagePrices = {
            'P0': 950, 'P1': 1300, 'P2': 2800, 'P3L': 3800, 'P3F': 5000, 'P4': 3200, 'START': 3200
        };
        const packageLimits = {
            'P0': { visits: 0, hours: 20 },
            'P1': { visits: 2, hours: 20 },
            'P2': { visits: 4, hours: 30 },
            'P3L': { visits: 6, hours: 35 },
            'P3F': { visits: 8, hours: 40 },
            'P4': { visits: 4, hours: 20 },
            'START': { visits: 4, hours: 25 }
        };

        const limits = packageLimits[packageName] || { visits: 0, hours: 0 };
        const price = packagePrices[packageName] || 0;
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + 1);

        db.run('INSERT INTO subscriptions (user_id, package_name, package_price, visits_limit, hours_limit, renewal_date) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, packageName, price, limits.visits, limits.hours, renewalDate.toISOString().split('T')[0]]
        );

        // Log
        db.run('INSERT INTO security_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [userId, 'REGISTER_SUCCESS', `Nowe konto: ${company_name} (${packageName})`, req.ip]
        );
        
        saveDatabase();

        res.status(201).json({ 
            message: 'Rejestracja pomyślna! Możesz się teraz zalogować.',
            user: { login, email, company_name, package: packageName }
        });

    } catch (error) {
        console.error('Błąd rejestracji:', error);
        res.status(500).json({ error: 'Błąd serwera podczas rejestracji' });
    }
});

module.exports = router;
