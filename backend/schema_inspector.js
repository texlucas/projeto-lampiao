// schema_inspector.js

import { Client } from 'pg';
import dotenv from 'dotenv';

// 1. Carrega o .env (necessário para pegar a DATABASE_URL)
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("ERRO: DATABASE_URL não encontrada no arquivo .env. Configure o arquivo.");
    process.exit(1);
}

const client = new Client({
    connectionString: DATABASE_URL,
});

async function listTables() {
    try {
        await client.connect();
        
        console.log("-----------------------------------------");
        console.log("Conexão estabelecida com sucesso! 🟢");
        
        // 2. Consulta SQL para listar as tabelas do BD
        const query = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `;

        const res = await client.query(query);
        
        if (res.rows.length === 0) {
            console.log("\n❌ Nenhuma tabela encontrada no BD.");
        } else {
            console.log("\n✅ TABELAS ENCONTRADAS:");
            res.rows.forEach((row, index) => {
                console.log(`${index + 1}. ${row.table_name}`);
            });
        }
    } catch (err) {
        console.error("\n❌ ERRO AO LER O BD. O erro foi:", err.message);
    } finally {
        await client.end();
        console.log("\n-----------------------------------------");
    }
}

listTables();