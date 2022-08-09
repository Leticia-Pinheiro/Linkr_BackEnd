import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

await connection.query(`
    CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        text TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
`)

export default connection;
