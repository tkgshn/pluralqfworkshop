import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg';
import { getProjects, Project } from './projects';

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
        // データベースからプロジェクト情報を取得
        const queryResult = await client.query('SELECT project_id, SUM(amount) as funded_amount, ARRAY_AGG(amount) as contributions, ARRAY_AGG(user_id) as donors, ARRAY_AGG(age) as ages FROM donations WHERE amount > 0 GROUP BY project_id ORDER BY project_id');

        const rows = queryResult.rows;

        const projects = getProjects();

        const result = rows.map((row, index) => {
            const project = projects.find((project: Project) => project.id == row.project_id);

            return {
                ...row,
                title: project ? project.title : 'Unknown',
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    } finally {
        client.release();
    }
}
