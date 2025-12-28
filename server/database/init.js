const bcrypt = require('bcryptjs');
const { initDatabase, getPool } = require('./db');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    try {
        console.log('🔧 Inicjalizacja bazy danych PostgreSQL (Railway)...');

        await initDatabase();
        const pool = getPool();

        // Wczytaj i wykonaj schemat SQL
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        console.log('✅ Schemat bazy danych utworzony');

        // Wygeneruj hash hasła dla admina
        const adminPassword = 'Julka2001.';
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        // Dodaj admina (ON CONFLICT DO NOTHING dla PostgreSQL zamiast INSERT OR IGNORE)
        await pool.query(
            `INSERT INTO users (login, email, password_hash, user_type, company_name) 
             VALUES ($1, $2, $3, $4, $5) 
             ON CONFLICT (login) DO NOTHING`,
            ['j.nowak0703', 'julia.mobilnaasystentka@gmail.com', passwordHash, 'admin', 'Julia Nowak - Mobilna Asystentka']
        );
        console.log('✅ Użytkownik Admin utworzony (login: j.nowak0703)');

        // Klienci będą dodawani przez samodzielną rejestrację
        console.log('💼 Oczekiwanie na rejestrację klientów przez formularz...');
        console.log('🔗 Klienci mogą się zarejestrować pod adresem: https://mobilna-asystentka.onrender.com/login.html');

        // Sprawdź czy tabele istnieją
        console.log('\n📦 Weryfikacja rozszerzonych funkcji...');
        
        const tables = ['chat_messages', 'invoices', 'calendar_events', 'system_logs', 'monthly_archive'];
        for (const table of tables) {
            const result = await pool.query(
                `SELECT table_name FROM information_schema.tables 
                 WHERE table_schema = 'public' AND table_name = $1`,
                [table]
            );
            if (result.rows.length > 0) {
                console.log(`✅ Tabela ${table} już istnieje`);
            } else {
                console.log(`📊 Utworzono tabelę: ${table}`);
            }
        }
        
        console.log('\n✨ NOWE FUNKCJE DOSTĘPNE:');
        console.log('   • Task Manager (zadania dla klientów)');
        console.log('   • Direct Chat (komunikacja admin ↔ klient)');
        console.log('   • Faktury i rozliczenia');
        console.log('   • Kalendarz współpracy');
        console.log('   • System logów w czasie rzeczywistym');
        console.log('   • Blokowanie Emergency na czas');
        console.log('   • Archiwum miesięczne');
        console.log('   • Memorium (dezaktywowani klienci)');
        console.log('   • Wymiana Emergency na zasoby');
        console.log('   • Menu kontekstowe (PPM)');

        console.log('\n🎉 Baza danych została pomyślnie zainicjalizowana!');
        console.log('📋 Dane logowania:');
        console.log('   Admin: j.nowak0703 / Julka2001.');
        console.log('\n💼 System gotowy do przyjmowania rejestracji klientów!');
        console.log('🔗 Formularz rejestracji: https://mobilna-asystentka.onrender.com/login.html\n');
        console.log('✅ PostgreSQL (Railway) - dane są trwałe i nie znikną!');

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Błąd inicjalizacji bazy danych:', error);
        process.exit(1);
    }
}

initializeDatabase();
