// Arquivo: backend/db.js
import postgres from 'postgres';
import 'dotenv/config';

// Pega a URL do arquivo .env 
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('ERRO: A variável DATABASE_URL não foi definida.');
}

const sql = postgres(connectionString);

export default sql;