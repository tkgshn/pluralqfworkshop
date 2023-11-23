
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
import { getAgeCluster } from './api/pluralqf-calculation'; // getAgeCluster関数をインポート

interface ProjectResult {
    project_id: string;
    title: string;
    contributions: String[];
    funded_amount: number;
    donors: String[];
    ages: String[];
    matched_amount: String[];
    pluralQF_amount: String[];
    [key: string]: any;
}

export default function Admin() {
    const [donations, setDonations] = useState<ProjectResult[]>([]);
    const [sortedDonations, setSortedDonations] = useState<ProjectResult[]>([]);
    const [total, setTotal] = useState(0);
    const matchingpool = 1000;

    const sortTable = (column: string, order: string) => {

        const sorted = [...donations].sort((a, b) => {
            if (column === 'pluralQF_amount') {
                const aValue = Math.floor(matchingpool * Number(a.pluralQF_amount) / total);
                const bValue = Math.floor(matchingpool * Number(b.pluralQF_amount) / total);
                if (order === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            } else {
                if (order === 'asc') {
                    return a[column] > b[column] ? 1 : -1;
                } else {
                    return a[column] < b[column] ? 1 : -1;
                }
            }
        });
        console.log(column + "のソートを受け取りました" + order + "順にソートします")
        setSortedDonations(sorted);
    }

    useEffect(() => {
        fetch(`${process.env.HEROKU_APP_URL}/api/admin`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('API request failed');
                }
                return response.json();
            })
            .then(data => {
                setDonations(data);
                return data;
            })
            .then(data => {
                if (data.length > 0) {
                    return fetch(`${process.env.HEROKU_APP_URL}/api/qf-calculation`, {
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
            .then(data => {
                if (data.length > 0) {
                    return fetch(`${process.env.HEROKU_APP_URL}/api/pluralqf-calculation`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data.map((donation: ProjectResult) => donation.contributions.map((contribution, index) => ({ amount: Number(contribution), age: Number(donation.ages[index]) })))),
                    })
                        .then(response => response.json())
                        .then(pluralQFData => {

                            return data.map((donation: ProjectResult, index: number) => {
                                console.log("pluralQFData", pluralQFData)


                                const totalValue = pluralQFData.flat().reduce((a: number, b: number) => a + b, 0);
                                setTotal(totalValue);


                                return {
                                    ...donation,
                                    pluralQF_amount: pluralQFData[index],
                                };
                            });
                        });
                } else {
                    return [];
                }
            })

            .then(updatedDonations => {
                // どれだけ寄付者が多次元的（複数のクラスタに属している）かを計算
                const updatedDonationsWithUniqueClusterCount = updatedDonations.map((donation: ProjectResult) => {
                    const donorClusters = donation.ages.map(age => getAgeCluster(Number(age)));

                    const uniqueClusterCount = [...new Set(donorClusters)].length;

                    return {
                        ...donation,
                        uniqueClusterCount,
                    };
                });

                setDonations(updatedDonationsWithUniqueClusterCount);
                setSortedDonations(updatedDonationsWithUniqueClusterCount);
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
                                    Nomal QF Match Amount
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => sortTable('matched_amount', 'asc')}>Ascending</MenuItem>
                                    <MenuItem onClick={() => sortTable('matched_amount', 'desc')}>Descending</MenuItem>
                                </MenuList>
                            </Menu>
                        </Th>
                        <Th>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="unstyled">
                                    Plural QF Match Amount
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => sortTable('pluralQF_amount', 'asc')}>Ascending</MenuItem>
                                    <MenuItem onClick={() => sortTable('pluralQF_amount', 'desc')}>Descending</MenuItem>
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
                                            <TagLabel>{`${donor} (${donation.ages[index]}old)`}</TagLabel>

                                        </Tag>
                                    ))}
                                    <br />
                                    Plural score: {donation.uniqueClusterCount}
                                </Box>
                            </Td>
                            <Td fontWeight="bold">{donation.funded_amount}</Td>
                            <Td>${Math.floor(Number(donation.matched_amount))}</Td>
                            <Td>${Math.floor(matchingpool * Number(donation.pluralQF_amount) / total)}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </>
    );
}

