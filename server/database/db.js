const { Pool } = require('pg');
const PostgreSQLWrapper = require('./db-wrapper');

// Connection string z Supabase - DIRECT CONNECTION (nie pooler)
const connectionString = process.env.DATABASE_URL || 
    'postgresql://postgres:gOgkviqlCTtnON6Q@db.fppzabmjqnfspmxysgno.supabase.co:5432/postgres';

let pool;
let dbWrapper;

async function initDatabase() {
    pool = new Pool({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        },
        // Dodatkowe opcje dla stabilności
        max: 3, // Maksymalnie 3 połączenia (Free tier limit)
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
