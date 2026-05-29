import {Request, Response} from 'express';
import pool from '../db';

export const getMe = async (req: Request, res: Response) => {
    const userId = req.userId;

    const userResult = await pool.query(
        'SELECT id, name, email FROM users WHERE id = $1',
        [userId]
    );

    if(userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: userResult.rows[0] });
}