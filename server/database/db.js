const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Upewnij się że folder data istnieje
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.db');

let db;

async function initDatabase() {
    const SQL = await initSqlJs();
    
    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }
    
    console.log('✅ Połączono z bazą danych SQLite:', dbPath);
    return db;
}

function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

// Zapisuj bazę przy zamykaniu procesu
process.on('exit', saveDatabase);
process.on('SIGINT', () => {
    saveDatabase();
    process.exit(0);
});

module.exports = { initDatabase, saveDatabase, getDb: () => db };
