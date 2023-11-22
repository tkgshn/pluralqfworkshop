import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'; //postgressを動かすために必要

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
    const { user_id, donations, age } = req.body;
    console.log("donations", donations, "user_id", user_id, "age", age);

    const client = await pool.connect();
    try {
        if (req.method === 'POST') {
            // 新規寄付の挿入処理
            for (const donation of donations) {
                await client.query('INSERT INTO donations (user_id, project_id, amount, age) VALUES ($1, $2, $3, $4)', [user_id, donation.id, donation.amount, age]);

            }
            res.status(200).json({ status: 'success' });
        } else if (req.method === 'PUT') {
            // 既存寄付の更新処理
            for (const donation of donations) {
                await client.query('UPDATE donations SET amount = $1, age = $2 WHERE user_id = $3 AND project_id = $4', [donation.amount, age, user_id, donation.id]);
            }
            res.status(200).json({ status: 'success' });
        } else {
            res.setHeader('Allow', ['POST', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    } finally {
        client.release();
    }
}
