import type { NextApiRequest, NextApiResponse } from 'next'

export function getAgeCluster(age: number) {
    // 年齢を配列に変換
    return age <= 20 ? 0 : age <= 30 ? 1 : age <= 40 ? 2 : age <= 50 ? 3 : age <= 60 ? 4 : 5;
}


function connection_oriented_cluster_match(groups: number[][], contributions: number[][]) {
    const agents = Array.from({ length: contributions.length }, (_, i) => i);
    const memberships = agents.map(i => groups.filter(g => g.includes(i)).length);
    const friend_matrix = agents.map(i => agents.map(j => groups.filter(g => g.includes(i) && g.includes(j)).length));

    console.log('Agents:', agents);
    console.log('Memberships:', memberships);
    console.log('Friend Matrix:', friend_matrix);


    let funding_amounts = [];


    for (let project = 0; project < contributions[0].length; project++) {
        let funding_amount = contributions.reduce((a, b) => a + b[project], 0);


        let K = function (i: number, h: number[]) {
            if (i >= friend_matrix.length) {
                console.error('Index out of bounds: i =', i, ', friend_matrix.length =', friend_matrix.length);
                return 0;
            }
            let result = friend_matrix[i].filter((_, j) => h.includes(j)).length > 0 ? Math.sqrt(contributions[i][project]) : contributions[i][project];
            console.log(`K(${i}, [${h}]) = ${result}`);
            return result;

        };

        // funding_amount += 2 * groups.flatMap((g1, i1) => groups.slice(i1 + 1).map(g2 => Math.sqrt(g1.reduce((a, b) => a + K(b, g2) / memberships[b], 0)) * Math.sqrt(g2.reduce((a, b) => a + K(b, g1) / memberships[b], 0)))).reduce((a, b) => a + b, 0);
        funding_amount += 2 * groups.flatMap((g1, i1) => groups.slice(i1 + 1).map(g2 => g1.filter(b => b < friend_matrix.length).reduce((a, b) => a + K(b, g2) / memberships[b], 0) * Math.sqrt(g2.filter(b => b < friend_matrix.length).reduce((a, b) => a + K(b, g1) / memberships[b], 0)))).reduce((a, b) => a + b, 0);

        console.log(`funding_amount = ${funding_amount}`);
        funding_amounts.push(funding_amount);
    }

    return funding_amounts;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // const donations: { amount: number, age: number }[][] = req.body;
    const donations: { amount: number, age: number, donor: string }[][] = req.body;
    const pluralQFData = donations.map(donation => {
        const groups = Array.from({ length: 6 }, (_, i) => donation.some(({ age }) => getAgeCluster(age) === i) ? [i] : []);
        // const contributions = donation.map(({ amount }) => amount);
        const contributions = donation.map(({ amount }) => [amount]);
        return connection_oriented_cluster_match(groups, contributions);
    });
    res.status(200).json(pluralQFData);
}
