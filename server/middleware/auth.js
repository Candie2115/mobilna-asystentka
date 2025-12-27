const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware weryfikacji tokena JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Brak tokena autoryzacji' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Nieprawidłowy lub wygasły token' });
        }
        req.user = user;
        next();
    });
};

// Middleware sprawdzania roli admina
const requireAdmin = (req, res, next) => {
    if (req.user.user_type !== 'admin') {
        return res.status(403).json({ error: 'Dostęp tylko dla administratorów' });
    }
    next();
};

// Middleware sprawdzania czy konto nie jest w Memorium
const checkActiveStatus = (req, res, next) => {
    if (req.user.status === 'memorium') {
        return res.status(403).json({ error: 'Konto zostało dezaktywowane. Skontaktuj się z administratorem.' });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    checkActiveStatus,
    JWT_SECRET
};
