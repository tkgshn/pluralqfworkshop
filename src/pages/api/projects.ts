import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';


export interface Project {
    id: String;
    title: String;
    description: String;
}

export const getProjects = (): Project[] => {
    const data = fs.readFileSync('projects.json', 'utf8');
    const projects: Project[] = JSON.parse(data);
    return Object.values(projects); // 修正
};

// プロジェクトのデータを取得するエンドポイント
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const projects = getProjects();
            res.status(200).json(projects);
        } else if (req.method === 'POST') {
            // ここで寄付データを保存する処理を実装します
        } else {
            // 未サポートのHTTPメソッドに対する処理
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        // エラー処理
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
}
