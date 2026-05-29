import pool from '../db';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface RegisterBody {
  name: string
  email: string
  password: string
}

interface LoginBody {
  email: string
  password: string
}

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )

    if(existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hashedPassword]
    )

    return res.status(201).json({ user: newUser.rows[0] });
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )

    if(userResult.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if(!await bcrypt.compare(password, userResult.rows[0].password)) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    //Gerar o token JWT com jwt.sign() e retornar para o cliente
    const token = jwt.sign(
        {userId: userResult.rows[0].id},
        process.env.JWT_SECRET!,
        {expiresIn: '7d'}
    );

    return res.json({ token });
}