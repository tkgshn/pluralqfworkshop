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

// sortTable(sortColumn, sortOrder);

// export default function Admin() {
//     // const [donations, setDonations] = useState<ProjectResult[]>([]);
//     // const [sortedDonations, setSortedDonations] = useState<ProjectResult[]>([]);
//     const [donations, setDonations] = useState<ProjectResult[]>([]);
//     const [sortedDonations, setSortedDonations] = useState<ProjectResult[]>([]);
//     const [sortColumn, setSortColumn] = useState<string>('project_id');
//     const [sortOrder, setSortOrder] = useState<string>('asc');



//     // const sortTable = (column: string, order: string) => {
//     //     const sorted = [...donations].sort((a, b) => {
//     //         if (order === 'asc') {
//     //             return a[column] > b[column] ? 1 : -1;
//     //         } else {
//     //             return a[column] < b[column] ? 1 : -1;
//     //         }
//     //     });
//     //     console.log(column + "のソートを受け取りました" + order + "順にソートします")
//     //     setSortedDonations(sorted);
//     // }
//     // // sortTable('project_id', 'asc');

//     // // useEffect内で初期のソートを行います
//     // useEffect(() => {
//     //     sortTable('project_id', 'asc');
//     // }, [donations]);
//     const sortTable = (column: string, order: string) => {
//         const sorted = [...donations].sort((a, b) => {
//             if (order === 'asc') {
//                 return a[column] > b[column] ? 1 : -1;
//             } else {
//                 return a[column] < b[column] ? 1 : -1;
//             }
//         });
//         console.log(column + "のソートを受け取りました" + order + "順にソートします")
//         setSortedDonations(sorted);

//     }
export default function Admin() {
    const [donations, setDonations] = useState<ProjectResult[]>([]);
    const [sortedDonations, setSortedDonations] = useState<ProjectResult[]>([]);
    const [sortColumn, setSortColumn] = useState<string>('project_id');
    const [sortOrder, setSortOrder] = useState<string>('asc');

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

    // useEffect(() => {
    //     sortTable(sortColumn, sortOrder);
    //     console.log("これが動く")
    // }, [sortColumn, sortOrder]);

    // useEffect(() => {
    //     sortTable('project_id', 'asc');
    // }, [donations]);
    // sortTable('project_id', 'asc');


    useEffect(() => {
        // sortTable(sortColumn, sortOrder);
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
        // sortTable(project_id, asc);
        console.log("adminを叩いています")
        // sortTable(sortColumn, sortOrder);
        // async sortTable('project_id', 'asc')
        // await
    }, []);
    // }, [donations]);


    // useEffect(() => {
    //     sortTable(sortColumn, sortOrder);
    // }, [donations, sortColumn, sortOrder]);


    // useEffect(() => {
    //     sortTable(sortColumn, sortOrder);
    //     console.log("これが無限ループになる原因？")
    // // }, [donations, sortColumn, sortOrder]);
    // }, []);
    // sortTable(sortColumn, sortOrder);

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
    // }, [donations]);
    }, [donations]);


    // useEffect(() => {
    //     console.log("ページが読み込まれました")
    //     // sortTable(sortColumn, sortOrder);
    // // }, [sortColumn, sortOrder]);
    // }, []); //初回のみ実行

    return (
        <>
            <Spacer height="20px" />
            <Table size="lg">
                <Thead>
                    <Tr>
                        <Th>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
                        {/* <Th>
                            <Menu>
                                <MenuButton as={Button} rightIcon="chevron-down">
                                    Funded Amount
                                </MenuButton>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    Funded Amount
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => sortTable('funded_amount', 'asc')}>Ascending</MenuItem>
                                    <MenuItem onClick={() => sortTable('funded_amount', 'desc')}>Descending</MenuItem>
                                </MenuList>
                            </Menu>
                        </Th> */}
                        {/* <Th>Match Amount</Th> */}
                        <Th>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
                {/* <Tbody>
                    {sortTable('some_column', 'asc').map((donation, index) => (
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
                </Tbody> */}
                <Tbody>
                    {/* {sortTable('some_column', 'asc').map((donation, index) => ( */}
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
