const { Pool } = require('pg');

// Użyj DATABASE_URL z Render (automatycznie ustawiona) lub SQLite lokalnie
const isProduction = process.env.DATABASE_URL ? true : false;

let db;
let pool;

if (isProduction) {
    // PostgreSQL na Render
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    console.log('✅ Połączono z PostgreSQL (Render)');
} else {
    // SQLite lokalnie
    const initSqlJs = require('sql.js');
    const fs = require('fs');
    const path = require('path');

    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'database.db');

    async function initSQLite() {
        const SQL = await initSqlJs();
        
        if (fs.existsSync(dbPath)) {
            const buffer = fs.readFileSync(dbPath);
            db = new SQL.Database(buffer);
        } else {
            db = new SQL.Database();
        }
        
        console.log('✅ Połączono z SQLite (lokalne):', dbPath);
        return db;
    }

    function saveSQLite() {
        if (db) {
            const data = db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(dbPath, buffer);
        }
    }

    process.on('exit', saveSQLite);
    process.on('SIGINT', () => {
        saveSQLite();
        process.exit(0);
    });

    module.exports = {
        initDatabase: initSQLite,
        saveDatabase: saveSQLite,
        getDb: () => db,
        isProduction: false
    };
    
    return;
}

// PostgreSQL funkcje
async function initDatabase() {
    // Tworzenie tabel
    await pool.query(`
        CREATE TABLE IF NOT EXISTS clients (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            package VARCHAR(10) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            client_id INTEGER REFERENCES clients(id),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            priority VARCHAR(20) DEFAULT 'normal',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS emergency (
            id SERIAL PRIMARY KEY,
            client_id INTEGER REFERENCES clients(id),
            message TEXT NOT NULL,
            phone VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved BOOLEAN DEFAULT FALSE
        )
    `);

    console.log('✅ Tabele PostgreSQL utworzone');
    return pool;
}

// Adapter do zachowania zgodności z SQL.js
function getDb() {
    return {
        exec: async (sql, params = []) => {
            try {
                const result = await pool.query(sql, params);
                // Konwertuj do formatu SQL.js
                return [{
                    columns: Object.keys(result.rows[0] || {}),
                    values: result.rows.map(row => Object.values(row))
                }];
            } catch (err) {
                console.error('Database error:', err);
                throw err;
            }
        },
        run: async (sql, params = []) => {
            return await pool.query(sql, params);
        }
    };
}

function saveDatabase() {
    // PostgreSQL zapisuje automatycznie
    console.log('✅ PostgreSQL - zapis automatyczny');
}

module.exports = {
    initDatabase,
    saveDatabase,
    getDb,
    getPool: () => pool,
    isProduction: true
};
