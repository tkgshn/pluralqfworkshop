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
    Avatar,
    Tag,
    TagLabel,
    Menu, MenuButton, MenuList, MenuItem, Button
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";


interface ProjectResult {
    project_id: string;
    title: string;
    contributions: String[];
    funded_amount: number;
    donors: String[];
    matched_amount: String[];
    [key: string]: any; // インデックスシグネチャを追加
}

export default function Admin() {
    const [donations, setDonations] = useState<ProjectResult[]>([]);
    const [sortedDonations, setSortedDonations] = useState<ProjectResult[]>([]);

    const sortTable = (column: string, order: string) => {
        const sorted = [...donations].sort((a, b) => {
            if (order === 'asc') {
                return a[column] > b[column] ? 1 : -1;
            } else {
                return a[column] < b[column] ? 1 : -1;
            }
        });
        console.log(column + "のソートを受け取りました" + order + "順にソートします")
        setSortedDonations(sorted);
    }

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/admin`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('API request failed');
                }
                return response.json();
            })
            .then(data => {
                setDonations(data);
                return data; // 次のthenブロックにデータを渡す
            })
            .then(data => {
                // ここでmatched_amountの計算を行う
                if (data.length > 0) {
                    return fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/qf-calculation`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data.map((donation: ProjectResult) => donation.contributions.map(Number))),
                    })
                        .then(response => response.json())
                        .then(matchedData => {
                            return data.map((donation: ProjectResult, index: number) => ({
                                ...donation,
                                matched_amount: matchedData[index]
                            }));
                        });
                } else {
                    return [];
                }
            })
            .then(updatedDonations => {
                // 更新されたdonationsで状態を更新
                setDonations(updatedDonations);
                setSortedDonations(updatedDonations);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);


    return (
        <>
            <Spacer height="20px" />
            <Table size="lg">
                <Thead>
                    <Tr>
                        <Th>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="unstyled">
                                    Projct ID
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => sortTable('project_id', 'asc')}>Ascending</MenuItem>
                                    <MenuItem onClick={() => sortTable('project_id', 'desc')}>Descending</MenuItem>
                                </MenuList>
                            </Menu>
                        </Th>
                        <Th>Title</Th>
                        <Th>Contributions</Th>
                        <Th>Donor(user_id)</Th>
                        <Th>Funded Amount</Th>
                        <Th>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="unstyled">
                                    Match Amount
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => sortTable('matched_amount', 'asc')}>Ascending</MenuItem>
                                    <MenuItem onClick={() => sortTable('matched_amount', 'desc')}>Descending</MenuItem>
                                </MenuList>
                            </Menu>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedDonations.map((donation, index) => (
                        <Tr key={index}>
                            <Td>{donation.project_id}</Td>
                            <Td fontWeight="bold">
                                <Box minW="200px">{donation.title}</Box>
                            </Td>
                            <Td>
                                {donation.contributions && donation.contributions.map((contribution, index) => (
                                    <Tag key={index} ml={index !== 0 ? 2 : 0}>
                                        <TagLabel>{`$${contribution}`}</TagLabel>
                                    </Tag>
                                ))}
                            </Td>
                            <Td>
                                <Box minW="200px">
                                    {donation.donors && donation.donors.map((donor, index) => (
                                        <Tag key={index} size='md' colorScheme='red' borderRadius='full' ml={index !== 0 ? 2 : 0}>
                                            <Avatar size='xs' ml={-2} mr={1} />
                                            <TagLabel>{donor}</TagLabel>
                                        </Tag>
                                    ))}
                                </Box>
                            </Td>
                            <Td fontWeight="bold">{donation.funded_amount}</Td>
                            <Td>${Math.floor(Number(donation.matched_amount))}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </>
    );
}
