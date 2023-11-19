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
        const queryResult = await client.query('SELECT project_id, SUM(amount) as total_amount, STRING_AGG(user_id::text, \',\') as donors FROM donations GROUP BY project_id HAVING SUM(amount) > 0');
        const rows = queryResult.rows;
        const projects = getProjects();
        const result = rows.map((row) => {
            const project = projects.find((project: Project) => project.id == row.project_id);
            return {
                ...row,
                title: project ? project.title : 'Unknown'
            };
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    } finally {
        client.release();
    }
}
