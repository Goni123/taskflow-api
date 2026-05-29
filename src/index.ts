import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db';
import { QueryResult } from 'pg';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import authMiddleware from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// Testa a ligação à base de dados
pool.query('SELECT NOW()')
  .then((result: QueryResult) => console.log('Database connected:', result.rows[0]))
  .catch((err: Error) => console.error('Database connection error:', err))

app.get('/health', (req, res) => {
    res.status(200).json({status: "ok"});
});

app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello user ${req.userId}` });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});