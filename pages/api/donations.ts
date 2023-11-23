
import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'; //postgressを動かすために必要


export interface Donation {
    id: String;// project_idのこと
    amount: Number;//どれぐらいの額か
}

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
    const client = await pool.connect();
    try {
        if (req.method === 'GET') {
            const { rows } = await client.query('SELECT * FROM donations');
            res.status(200).json(rows);
        } else {
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    } finally {
        client.release();
    }
}
