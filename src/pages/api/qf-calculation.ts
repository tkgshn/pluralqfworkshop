import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const donations: number[][] = req.body;
    // const donations = [
    //     [6, 4, 4],
    //     [1],
    //     [5, 5],
    //     [6],
    //     [1]
    // ];

    const matchingPool: number = 1000;

    let summedSqrts = donations.map((project: number[]) =>
        project.reduce((sum: number, donation: number) => sum + Math.sqrt(donation), 0)
    );

    let sumOfSquaredSums = summedSqrts.reduce((sum: number, sqrtSum: number) => sum + sqrtSum ** 2, 0);

    let matchAmounts = summedSqrts.map((sqrtSum: number) =>
        (sqrtSum ** 2 / sumOfSquaredSums) * matchingPool
    );

    let roundedMatchAmounts = matchAmounts.map((amount: number) => Math.floor(amount));

    res.status(200).json(roundedMatchAmounts);
}
