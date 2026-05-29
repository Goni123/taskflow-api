import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db';
import { QueryResult } from 'pg';


const app = express();

app.use(cors());
app.use(express.json());

// Testa a ligação à base de dados
pool.query('SELECT NOW()')
  .then((result: QueryResult) => console.log('Database connected:', result.rows[0]))
  .catch((err: Error) => console.error('Database connection error:', err))

app.get('/health', (req, res) => {
    res.status(200).json({status: "ok"});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});