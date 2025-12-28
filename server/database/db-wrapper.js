// Wrapper który emuluje SQLite API na PostgreSQL
// Dzięki temu nie musimy przepisywać wszystkich routes

class PostgreSQLWrapper {
    constructor(pool) {
        this.pool = pool;
    }

    // Konwertuje placeholders SQLite (?) na PostgreSQL ($1, $2, ...)
    convertPlaceholders(sql) {
        let index = 1;
        return sql.replace(/\?/g, () => `$${index++}`);
    }

    // Emuluje db.exec() z SQLite
    async exec(sql, params = []) {
        try {
            // Konwertuj placeholders
            const convertedSql = this.convertPlaceholders(sql);
            const result = await this.pool.query(convertedSql, params);
            
            // Zwróć w formacie SQLite
            if (result.rows.length === 0) {
                return [];
            }

            const columns = Object.keys(result.rows[0]);
            const values = result.rows.map(row => Object.values(row));

            return [{
                columns: columns,
                values: values
            }];
        } catch (error) {
            console.error('Database exec error:', error);
            console.error('SQL:', sql);
            console.error('Params:', params);
            throw error;
        }
    }

    // Emuluje db.run() z SQLite
    async run(sql, params = []) {
        try {
            // Konwertuj placeholders
            const convertedSql = this.convertPlaceholders(sql);
            await this.pool.query(convertedSql, params);
        } catch (error) {
            console.error('Database run error:', error);
            console.error('SQL:', sql);
            console.error('Params:', params);
            throw error;
        }
    }

    // Bezpośredni dostęp do pool jeśli potrzeba
    getPool() {
        return this.pool;
    }
}

module.exports = PostgreSQLWrapper;
