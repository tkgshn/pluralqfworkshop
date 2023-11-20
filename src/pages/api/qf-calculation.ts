import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { donations} = req.body;
    const matchingPool: number = 1000;
    // const { donations, matchingPool } = req.body;
    const sqrtSums = donations.map((project: number[]) =>
        project.reduce((sum: number, donation: number) => sum + Math.sqrt(donation), 0)
    );

    const totalSqrtSumSquared = sqrtSums.reduce((sum: number, sqrtSum: number) => sum + sqrtSum ** 2, 0);

    const funding = sqrtSums.map((sqrtSum: number) =>
        (sqrtSum ** 2 / totalSqrtSumSquared) * matchingPool
    );

    res.status(200).json(funding);
}
