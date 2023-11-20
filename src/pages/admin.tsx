import { useEffect, useState } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Container,
    Spacer,
    Center,
    // Avatar,
    NumberInput,
    NumberInputField,
} from "@chakra-ui/react";

interface ProjectResult {
    project_id: string;
    title: string;
    contributions: String[]; // 追加
    funded_amount: number;
    donors: String[];
    matched_amount: String[];
}



export default function Admin() {
    const [donations, setDonations] = useState<ProjectResult[]>([]);
    // const [matchingPool, setMatchingPool] = useState(1000);


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
                body: JSON.stringify({ donations: donations.map(donation => [donation.funded_amount]) }),
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

    // const handleMatchingPoolChange = (event: any) => {
    //     setMatchingPool(event.target.value);
    // };

    return (
        <>
        {/* // <Container maxW="container.xl" centerContent>
        // <Center h="100vh">
        //     <Box maxW="container.md" mx="auto"> */}
                <Spacer height="20px" />
                {/* <Box maxW="100%"> */}
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
                                    {/* <Td>{donation.matched_amount}</Td> */}
                                    <Td>${Math.floor(Number(donation.matched_amount))}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                {/* </Box> */}
                {/* </div> */}
        {/* //     </Box>
        // </Center> */}
            </>
    );
}
