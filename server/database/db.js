const { Pool } = require('pg');
const PostgreSQLWrapper = require('./db-wrapper');

// Connection string z Railway (będzie pobierany z .env)
const connectionString = process.env.DATABASE_URL || 
    'postgresql://postgres:DpOdUbLmIcMlqfkKeqpdAeGQJmpbWxRh@tramway.proxy.rlwy.net:38997/railway';

let pool;
let dbWrapper;

async function initDatabase() {
    pool = new Pool({
        connectionString: connectionString,
        ssl: false, // Railway nie wymaga SSL
        max: 3,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });

    try {
        const client = await pool.connect();
        console.log('✅ Połączono z bazą danych PostgreSQL (Supabase)');
        client.release();
        
        // Utwórz wrapper który emuluje SQLite API
        dbWrapper = new PostgreSQLWrapper(pool);
        
        return pool;
    } catch (error) {
        console.error('❌ Błąd połączenia z bazą danych:', error);
        throw error;
    }
}

// PostgreSQL nie wymaga manualnego zapisu - dane są zapisywane automatycznie
function saveDatabase() {
    // Pusta funkcja dla kompatybilności z istniejącym kodem
    // PostgreSQL zapisuje automatycznie po każdym query
}

function getDb() {
    return dbWrapper; // Zwracamy wrapper zamiast pool
}

// Zamknij połączenie przy wyłączaniu
process.on('exit', () => {
    if (pool) pool.end();
});
process.on('SIGINT', () => {
    if (pool) pool.end();
    process.exit(0);
});

module.exports = { initDatabase, saveDatabase, getDb };
