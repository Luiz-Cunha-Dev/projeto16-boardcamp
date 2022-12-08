import dotenv from "dotenv";
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

export let connection;

try {
   connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} catch (err) {
    console.log("Erro ao conectar no banco de dados: ", err);
}

