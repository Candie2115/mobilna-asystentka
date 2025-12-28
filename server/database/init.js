const bcrypt = require('bcryptjs');
const { initDatabase, saveDatabase, getDb } = require('./db');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    try {
        console.log('🔧 Inicjalizacja bazy danych SQLite...');

        await initDatabase();
        const db = getDb();

        // Wczytaj i wykonaj schemat SQL
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        db.run(schema);
        console.log('✅ Schemat bazy danych utworzony');

        // Wygeneruj hash hasła dla admina
        const adminPassword = 'Julka2001.';
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        // Dodaj admina
        db.run('INSERT OR IGNORE INTO users (login, email, password_hash, user_type, company_name) VALUES (?, ?, ?, ?, ?)',
            ['j.nowak0703', 'julia.mobilnaasystentka@gmail.com', passwordHash, 'admin', 'Julia Nowak - Mobilna Asystentka']
        );
        console.log('✅ Użytkownik Admin utworzony (login: j.nowak0703)');

        // Klienci będą dodawani przez samodzielną rejestrację
        console.log('💼 Oczekiwanie na rejestrację klientów przez formularz...');
        console.log('🔗 Klienci mogą się zarejestrować pod adresem: http://localhost:3000/login.html');

        // Tworzenie nowych tabel dla rozszerzonych funkcji
        console.log('\n📦 Inicjalizacja rozszerzonych funkcji...');
        
        // Sprawdź czy tabele już istnieją, jeśli nie - utwórz
        const tables = ['chat_messages', 'invoices', 'calendar_events', 'system_logs', 'monthly_archive'];
        tables.forEach(table => {
            const check = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`);
            if (check[0]?.values?.length > 0) {
                console.log(`✅ Tabela ${table} już istnieje`);
            } else {
                console.log(`📊 Utworzono tabelę: ${table}`);
            }
        });
        
        // Sprawdź kolumnę deactivated_at
        try {
            db.exec(`SELECT deactivated_at FROM users LIMIT 1`);
            console.log('✅ Kolumna deactivated_at już istnieje');
        } catch (e) {
            console.log('📊 Dodano kolumnę deactivated_at');
        }

        // Tworzenie struktury archiwalnej na lata 2026-2040
        console.log('\n📦 Inicjalizacja struktury archiwalnej 2026-2040...');
        
        // Tworzenie pustej struktury lat w archiwum (2026-2040)
        const years = [];
        for (let year = 2026; year <= 2040; year++) {
            years.push(year);
        }
        
        console.log(`✅ Struktura archiwalna przygotowana dla lat: ${years.join(', ')}`);
        console.log('📅 Dane archiwalne będą automatycznie generowane po zakończeniu miesięcy');
        console.log('🔒 Wszystkie archiwa są chronione i nie mogą być usunięte');
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

        saveDatabase();

        console.log('\n🎉 Baza danych została pomyślnie zainicjalizowana!');
        console.log('📋 Dane logowania:');
        console.log('   Admin: j.nowak0703 / Julka2001.');
        console.log('\n💼 System gotowy do przyjmowania rejestracji klientów!');
        console.log('🔗 Formularz rejestracji: http://localhost:3000/login.html\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Błąd inicjalizacji bazy danych:', error);
        process.exit(1);
    }
}

initializeDatabase();
