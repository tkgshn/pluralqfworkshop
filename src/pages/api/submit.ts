import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'; //postgressを動かすために必要
import { Donation } from './donations';

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
    const { user_id, donations } = req.body;
    const client = await pool.connect();
    try {
        for (const donation of donations) {
            await client.query('INSERT INTO donations (user_id, project_id, amount) VALUES ($1, $2, $3)', [user_id, donation.id, donation.amount]);
        }
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    } finally {
        client.release();
    }
}
