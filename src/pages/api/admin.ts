// import type { NextApiRequest, NextApiResponse } from 'next'
// import { Pool } from 'pg';
// import { getProjects, Project } from './projects';

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });


// function getAgeCluster(age: number) {
//     // 年齢を配列に変換
//     return [[age <= 20 ? 0 : age <= 30 ? 1 : age <= 40 ? 2 : age <= 50 ? 3 : age <= 60 ? 4 : 5]];
// }

// const calculateFriendMatrix = (groups: number[][]) => {
//     let maxAgentId = Math.max(...groups.flat());
//     let matrix = Array.from({ length: maxAgentId + 1 }, () =>
//         Array(maxAgentId + 1).fill(0));

//     groups.forEach(group => {
//         group.forEach(agent1 => {
//             group.forEach(agent2 => {
//                 if (agent1 !== agent2) {
//                     matrix[agent1][agent2]++;
//                 }
//             });
//         });
//     });

//     return matrix;
// };


// // Plural QFを計算する関数
// function calculatePluralQF(groups: number[][], contributions: number[]): number {

//     console.log('groups:', groups); // 追加
//     // groups: [
//     //     [3, 4],
//     //     [3, 3],
//     //     [4],
//     //     [4, 4, 4, 11, 36, 2],
//     //     [31],
//     //     [5, 4],
//     //     [5, 2],
//     //     [8]
//     // ]
//     console.log('contributions:', contributions); // 追加
//     // contributions: [[[0]], [[0]]]

//     if (!Array.isArray(groups) || !Array.isArray(contributions)) {
//         throw new Error("Invalid input format");
//     }

//     // const agents = contributions.map((_, index) => index);
//     const agents = contributions.map((_, index) => index);
//     console.log('Agents:', agents);

//     if (agents.some(agent => contributions[agent] < 0)) {
//         throw new Error("Negative contributions not supported");
//     }

//     const memberships = agents.map(agent => groups.filter(group => group.includes(agent)).length);
//     // const friendMatrix = agents.map(j => agents.map(i => groups.filter(g => g.includes(i) && g.includes(j)).length));
//     // const friendMatrix = agents.map(j => agents.map(i => groups.filter(g => g.includes(i) && g.includes(j)).length));
//     // console.log('friendMatrix:', friendMatrix);
//     // const friendMatrix = agents.map(j =>
//     //     agents.map(i => groups.filter(g => g.includes(i) && g.includes(j)).length)
//     // );
//     const friendMatrix = calculateFriendMatrix(groups);

//     console.log('Friend Matrix:', friendMatrix);



//     let fundingAmount = contributions.reduce((sum, current) => sum + current, 0);

//     // const combinations = (arr: number[][], k: number): number[][][] => {
//     //     console.log('combinations result:', combinations(arr, k));
//     //     if (arr.length < k) return [];
//     //     // if (k === 1) return arr.map(el => [el]);
//     //     // return arr.reduce((acc, val, i) => [
//     //     //     ...acc,
//     //     //     ...combinations(arr.slice(i + 1), k - 1).map(el => [val, ...el])
//     //     // ], []);
//     //     // if (k === 1) return arr.map(el => [[el]]);
//     //     if (k === 1) return arr.map(el => [el]);
//     //     // return arr.reduce((acc, val, i) => [
//     //     //     ...acc,
//     //     //     ...combinations(arr.slice(i + 1), k - 1).map(el => [val, ...el])
//     //     // ], []);

//     //     return arr.reduce((acc: number[][][], val: number[], i: number) => [
//     //         ...acc,
//     //         ...combinations(arr.slice(i + 1), k - 1).map(el => [val, ...el])
//     //     ], [] as number[][][]);
//     // };
//     const combinations = (arr: number[][], k: number): number[][][] => {
//         if (k === 0) return [[]];
//         if (arr.length < k) return [];

//         let result: number[][][] = [];
//         for (let i = 0; i <= arr.length - k; i++) {
//             let head = arr.slice(i, i + 1);
//             let tailcombs = combinations(arr.slice(i + 1), k - 1);
//             for (let j = 0; j < tailcombs.length; j++) {
//                 result.push(head.concat(tailcombs[j]));
//             }
//         }
//         return result;
//     };


//     const K = (i: number, h: number[]): number => {
//         // console.log('K function result:', K(i, h));
//         console.log(`K function called with i=${i}, h=${h}`);
//         // return h.reduce((sum, j) => sum + friendMatrix[i][j], 0) > 0 ? Math.sqrt(contributions[i]) : contributions[i];
//         return h.reduce((sum, j) => {
//             if (j >= 0 && j < friendMatrix.length && i >= 0 && i < friendMatrix[j].length) {
//                 return sum + friendMatrix[i][j];
//             } else {
//                 console.error(`Invalid index in friendMatrix: i=${i}, j=${j}`);
//                 return sum;
//             }
//         }, 0) > 0 ? Math.sqrt(contributions[i]) : contributions[i];
//     };
//     // console.log('K function result:', K);




//     const groupCombos = combinations(groups, 2);
//     fundingAmount += groupCombos.reduce((sum, [g1, g2]) => {

//         const term1 = Math.sqrt(g1.reduce((s, i) => {
//             let kResult = K(i, g2);
//             console.log(`K function result for i=${i}, g2=${g2}:`, kResult);
//             return s + kResult / memberships[i];
//         }, 0));

//         // term2の計算
//         const term2 = Math.sqrt(g2.reduce((s, j) => {
//             let kResult = K(j, g1);
//             console.log(`K function result for j=${j}, g1=${g1}:`, kResult);
//             return s + kResult / memberships[j];
//         }, 0));

//         return sum + 2 * term1 * term2;
//     }, 0);

//     return fundingAmount;
// }

// // export default async function handler(
// //     req: NextApiRequest,
// //     res: NextApiResponse


// // ) {
// //     const client = await pool.connect();
// //     try {
// //         const queryResult = await client.query('SELECT project_id, SUM(amount) as funded_amount, ARRAY_AGG(amount) as contributions, ARRAY_AGG(user_id) as donors FROM donations WHERE amount > 0 GROUP BY project_id ORDER BY project_id');
// //             // | project_id | total_amount | contributions       | donors   |
// //             // |------------|--------------|---------------------|----------|
// //             // |     1      | 14.00        | { 6.00, 4.00, 4.00} | { 1, 2, 5}|
// //             // |     3      | 1.00         | { 1.00}             | { 100}   |
// //             // |     5      | 10.00        | { 5.00, 5.00}       | { 1, 2}  |
// //             // |     8      | 6.00         | { 6.00}             | { 1}     |
// //             // |     9      | 1.00         | { 1.00}             | { 2}     |

// //         const rows = queryResult.rows;
// //         const projects = getProjects();
// //         const result = rows.map((row) => {
// //             const project = projects.find((project: Project) => project.id == row.project_id);
// //             return {
// //                 ...row,
// //                 title: project ? project.title : 'Unknown'
// //             };
// //         });
// //         res.status(200).json(result);
// //     } catch (error) {
// //         res.status(500).json({ error: 'サーバーエラーが発生しました' });
// //     } finally {
// //         client.release();
// //     }
// // }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     const client = await pool.connect();
//     try {
//         const queryResult = await client.query('SELECT project_id, SUM(amount) as funded_amount, ARRAY_AGG(amount) as contributions, ARRAY_AGG(user_id) as donors, ARRAY_AGG(age) as ages FROM donations WHERE amount > 0 GROUP BY project_id ORDER BY project_id');
//             // | project_id | funded_amount | contributions       | donors   | ages |
//             // |------------|---------------|---------------------|----------|------|
//             // |     1      | 7.00         | { 3.00, 4.00}       | { 1, 3}  | { 20, 10} |
//             // |     2      | 6.00         | { 3.00, 3.00}       | { 2, 4}  | { 30, 33} |
//             // |     4      | 4.00         | { 4.00}             | { 10}    | { 42} |
//             // |     5      | 61.00        | { 4.00, 4.00, 4.00, 11.00, 36.00, 2.00} | { 1, 2, 3, 4, 6, 9} | { 20, 30, 10, 33, 60, 81} |
//             // |     6      | 31.00        | { 31.00}            | { 5}     | { 40} |
//             // |     8      | 9.00         | { 5.00, 4.00}       | { 1, 3}  | { 20, 10} |
//             // |     9      | 7.00         | { 5.00, 2.00}       | { 3, 10} | { 10, 42} |
//             // |     10     | 8.00         | { 8.00}             | { 4}     | { 33} |

//         const rows = queryResult.rows;
//         console.log('rows:', rows); // 追加
//         // rows: [
//         //     {
//         //         project_id: 1,
//         //         funded_amount: '7.00',
//         //         contributions: [3, 4],
//         //         donors: [1, 3],
//         //         ages: [20, 10]
//         //     },
//         //     {
//         //         project_id: 2,
//         //         funded_amount: '6.00',
//         //         contributions: [3, 3],
//         //         donors: [2, 4],
//         //         ages: [30, 33]
//         //     },
//         //     {
//         //         project_id: 4,
//         //         funded_amount: '4.00',
//         //         contributions: [4],
//         //         donors: [10],
//         //         ages: [42]
//         //     },
//         //     {
//         //         project_id: 5,
//         //         funded_amount: '61.00',
//         //         contributions: [4, 4, 4, 11, 36, 2],
//         //         donors: [1, 2, 3, 4, 6, 9],
//         //         ages: [20, 30, 10, 33, 60, 81]
//         //     },
//         //     {
//         //         project_id: 6,
//         //         funded_amount: '31.00',
//         //         contributions: [31],
//         //         donors: [5],
//         //         ages: [40]
//         //     },
//         //     {
//         //         project_id: 8,
//         //         funded_amount: '9.00',
//         //         contributions: [5, 4],
//         //         donors: [1, 3],
//         //         ages: [20, 10]
//         //     },
//         //     {
//         //         project_id: 9,
//         //         funded_amount: '7.00',
//         //         contributions: [5, 2],
//         //         donors: [3, 10],
//         //         ages: [10, 42]
//         //     },
//         //     {
//         //         project_id: 10,
//         //         funded_amount: '8.00',
//         //         contributions: [8],
//         //         donors: [4],
//         //         ages: [33]
//         //     }
//         // ]
//         const projects = getProjects();
//         const contributionsArray = rows.map(row => row.contributions.map(Number));
//         // const groupsArray = rows.map(row => row.ages.map(getAgeCluster));
//         const groupsArray = rows.map(row => {
//             // 各寄付に対する年齢クラスタを取得
//             return row.ages.map((age: number) => getAgeCluster(age));
//         });

//         console.log('Contributions Array:', contributionsArray);
//         console.log('Groups Array:', groupsArray);

//         const result = rows.map((row, index) => {
//             const project = projects.find((project: Project) => project.id == row.project_id);
//             const contributions = rows.map(row => row.contributions.map((contribution: number) => Number(contribution)));
//             console.log('contributions:', contributions); // 形式をチェック
//             const groups = row.ages.map(getAgeCluster);
//             console.log('groups:', groups);
//             // const pluralQF = calculatePluralQF(contributions, groups);
//             const pluralQF = calculatePluralQF(groupsArray[index], contributionsArray[index]);

//             return {
//                 ...row,
//                 title: project ? project.title : 'Unknown',
//                 pluralQF: pluralQF
//             };
//         });
//         res.status(200).json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'サーバーエラーが発生しました' });
//     } finally {
//         client.release();
//     }
// }


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
        // console.log('Database rows:', rows);

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
