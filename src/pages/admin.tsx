import { useEffect, useState } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Spacer,
} from "@chakra-ui/react";

interface ProjectResult {
    project_id: string;
    title: string;
    contributions: String[];
    funded_amount: number;
    donors: String[];
    matched_amount: String[];
}



export default function Admin() {
    const [donations, setDonations] = useState<ProjectResult[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/admin`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('API request failed');
                }
                return response.json();
            })
            .then(data => setDonations(data))
            .catch(error => {
                console.error(error);
            });


    }, []);

    useEffect(() => {
        if (donations.length > 0) {
            fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/qf-calculation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donations.map(donation => donation.contributions.map(Number))),
            })
                .then(response => response.json())
                .then(data => {
                    const updatedDonations = donations.map((donation, index) => ({
                        ...donation,
                        matched_amount: data[index]
                    }));
                    setDonations(updatedDonations);
                });
        }
    }, [donations]);

    return (
        <>
                <Spacer height="20px" />
                    <Table size="lg">
                        <Thead>
                            <Tr>
                                <Th>Project ID</Th>
                                <Th>Title</Th>
                                <Th>Contributions</Th>
                                <Th>Donor(user_id)</Th>
                                <Th>Funded Amount</Th>
                                <Th>Match Amount</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {donations.map((donation, index) => (
                                <Tr key={index}>
                                    <Td>{donation.project_id}</Td>
                                    <Td fontWeight="bold">
                                        <Box minW="150px">{donation.title}</Box>
                                    </Td>
                                    <Td>{donation.contributions.map(contribution => `$${contribution}`).join(', ')}</Td>
                                    <Td>{donation.donors.join(', ')}</Td>
                                    <Td fontWeight="bold">{donation.funded_amount}</Td>
                                    <Td>${Math.floor(Number(donation.matched_amount))}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
            </>
    );
}
