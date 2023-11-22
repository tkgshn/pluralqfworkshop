import type { NextApiRequest, NextApiResponse } from 'next'

function getAgeCluster(age: number) {
    // 年齢を配列に変換
    return age <= 20 ? 0 : age <= 30 ? 1 : age <= 40 ? 2 : age <= 50 ? 3 : age <= 60 ? 4 : 5;
}

// function connection_oriented_cluster_match(groups, contributions) {
// function connection_oriented_cluster_match(groups: number[][], contributions: number[]) {
//     const agents = Array.from({ length: contributions.length }, (_, i) => i);
//     const memberships = agents.map(i => groups.filter(g => g.includes(i)).length);
//     const friend_matrix = agents.map(i => agents.map(j => groups.filter(g => g.includes(i) && g.includes(j)).length));

//     console.log('Contributions:', contributions);
//     console.log('Friend Matrix:', friend_matrix);

//     let funding_amount = contributions.reduce((a, b) => a + b, 0);

//     function K(i:any, h:any) {
//         return friend_matrix[i].filter((_, j) => h.includes(j)).length > 0 ? Math.sqrt(contributions[i]) : contributions[i];
//     }

//     funding_amount += 2 * groups.flatMap((g1, i1) => groups.slice(i1 + 1).map(g2 => Math.sqrt(g1.reduce((a, b) => a + K(b, g2) / memberships[b], 0)) * Math.sqrt(g2.reduce((a, b) => a + K(b, g1) / memberships[b], 0)))).reduce((a, b) => a + b, 0);

//     return funding_amount;
// }
function connection_oriented_cluster_match(groups: number[][], contributions: number[][]) {
    const agents = Array.from({ length: contributions.length }, (_, i) => i);
    const memberships = agents.map(i => groups.filter(g => g.includes(i)).length);
    const friend_matrix = agents.map(i => agents.map(j => groups.filter(g => g.includes(i) && g.includes(j)).length));

    // const friend_matrix = groups.map(g => agents.map(i => agents.map(j => g.includes(i) && g.includes(j) ? 1 : 0))); //この変更はよくわからん

    console.log('Agents:', agents);
    console.log('Memberships:', memberships);
    console.log('Friend Matrix:', friend_matrix);


    let funding_amounts = [];

    for (let project = 0; project < contributions[0].length; project++) {
        let funding_amount = contributions.reduce((a, b) => a + b[project], 0);

        // let K = function (i: number, h: number[]) {
        //     console.log(`K Function - i: ${i}, h:`, h);
        //     if (i >= friend_matrix.length) {
        //         console.error(`Index out of bounds: i = ${i}, friend_matrix.length = ${friend_matrix.length}`);
        //     } else if (!friend_matrix[i]) {
        //         console.error(`friend_matrix[i] is undefined: i = ${i}`);
        //     }

        //     return friend_matrix[i].filter((_, j) => h.includes(j)).length > 0 ? Math.sqrt(contributions[i][project]) : contributions[i][project];
        // };

        // let K = function (i: number, h: number[]) {
        //     if (i < 0 || i >= friend_matrix.length) {
        //         console.error(`Invalid index i: ${i}`);
        //         return 0; // 無効なインデックスの場合は0を返す
        //     }

        //     return friend_matrix[i].filter((_, j) => h.includes(j)).length > 0 ? Math.sqrt(contributions[i][project]) : contributions[i][project];
        // };

        // // ある意味動いている？
        let K = function (i: number, h: number[]) {
            if (i >= friend_matrix.length) {
                console.error('Index out of bounds: i =', i, ', friend_matrix.length =', friend_matrix.length);
                return 0;
            }
            let result = friend_matrix[i].filter((_, j) => h.includes(j)).length > 0 ? Math.sqrt(contributions[i][project]) : contributions[i][project];
            console.log(`K(${i}, [${h}]) = ${result}`);
            return result;
            // return friend_matrix[i].filter((_, j) => h.includes(j)).length > 0 ? Math.sqrt(contributions[i][project]) : contributions[i][project];
        };


        // chatgPtのコード
        // let K = function (i: number, h: number[]) {
        //     if (i >= friend_matrix.length || i < 0) {
        //         console.error('Index out of bounds: i =', i, ', friend_matrix.length =', friend_matrix.length);
        //         return 0;
        //     }
        //     if (!contributions[i] || project >= contributions[i].length || project < 0) {
        //         console.error('Invalid access: contributions[i] =', contributions[i], ', project =', project);
        //         return 0;
        //     }

        //     let result = friend_matrix[i].filter((_, j) => h.includes(j)).length > 0 ? Math.sqrt(contributions[i][project]) : contributions[i][project];
        //     console.log(`K(${i}, [${h}]) = ${result}`);
        //     return result;
        // };




        // funding_amount += 2 * groups.flatMap((g1, i1) => groups.slice(i1 + 1).map(g2 => Math.sqrt(g1.reduce((a, b) => a + K(b, g2) / memberships[b], 0)) * Math.sqrt(g2.reduce((a, b) => a + K(b, g1) / memberships[b], 0)))).reduce((a, b) => a + b, 0);
        funding_amount += 2 * groups.flatMap((g1, i1) => groups.slice(i1 + 1).map(g2 => Math.sqrt(g1.reduce((a, b) => a + K(b, g2) / memberships[b], 0)) * Math.sqrt(g2.reduce((a, b) => a + K(b, g1) / memberships[b], 0)))).reduce((a, b) => a + b, 0);
        console.log(`funding_amount = ${funding_amount}`);
        funding_amounts.push(funding_amount);
    }

    return funding_amounts;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const donations: { amount: number, age: number }[][] = req.body;
    const pluralQFData = donations.map(donation => {
        const groups = Array.from({ length: 6 }, (_, i) => donation.some(({ age }) => getAgeCluster(age) === i) ? [i] : []);
        // const contributions = donation.map(({ amount }) => amount);
        const contributions = donation.map(({ amount }) => [amount]);
        return connection_oriented_cluster_match(groups, contributions);
    });
    res.status(200).json(pluralQFData);
}
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     const donations: { amount: number, age: number }[][] = req.body;
//     const groups = Array.from({ length: 6 }, (_, i) => donations.flatMap((d, j) => d.some(({ age }) => getAgeCluster(age) === i) ? [j] : []));
//     const contributions = donations.map(d => d.reduce((a, { amount }) => a + amount, 0));

//     // const pluralQF = connection_oriented_cluster_match(groups, contributions);
//     try {
//         const pluralQF = connection_oriented_cluster_match(groups, contributions);
//         res.status(200).json(pluralQF);
//     } catch (error) {
//         console.error('Error in Plural QF calculation:', error);
//         res.status(500).json({ error: 'Error in Plural QF calculation' });
//     // }
//     }

//     // res.status(200).json(pluralQF);
// }

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     const donations: { amount: number, age: number }[][][] = req.body;
//     const pluralQFData = donations.map(donation => {
//         const groups = Array.from({ length: 6 }, (_, i) => donation.flatMap((d, j) => d.some(({ age }) => getAgeCluster(age) === i) ? [j] : []));
//         const contributions = donation.map(d => d.map(({ amount }) => amount));
//         return connection_oriented_cluster_match(groups, contributions);
//     });
//     res.status(200).json(pluralQFData);
// }

// export default function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     const donations: { amount: number, age: number }[][] = req.body;

//     const matchingPool: number = 1000;

//     let summedSqrts = donations.map((project: { amount: number, age: number }[]) =>
//         project.reduce((sum: number, donation: { amount: number, age: number }) => sum + Math.sqrt(donation.amount) * getAgeCluster(donation.age), 0)
//     );

//     let sumOfSquaredSums = summedSqrts.reduce((sum: number, sqrtSum: number) => sum + sqrtSum ** 2, 0);

//     let matchAmounts = summedSqrts.map((sqrtSum: number) =>
//         (sqrtSum ** 2 / sumOfSquaredSums) * matchingPool
//     );

//     let roundedMatchAmounts = matchAmounts.map((amount: number) => Math.floor(amount));

//     res.status(200).json(roundedMatchAmounts);
// }
