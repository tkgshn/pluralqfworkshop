import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user_id } = req.query;
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM donations WHERE user_id = $1', [user_id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    } finally {
        client.release();
    }
}
