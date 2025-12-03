// backend/db/postgres.ts

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// 1. Carrega as variáveis do .env
dotenv.config();

// 2. Cria o Pool de Conexões
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log("Pool de conexões PostgreSQL inicializado.");

// 3. Exporta o pool para ser usado nos Services
export default pool;