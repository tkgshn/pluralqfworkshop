import { useState, useEffect } from 'react';
import { getProjects, Project } from "./api/projects";
import { GetServerSideProps } from 'next';

import {
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Progress,
  Stack,
  StackDivider,
  Spacer,
  Box,
  Center,
  Tooltip,
} from "@chakra-ui/react";

interface Props {
  projects: Project[];
  budget: number;
  userId: number;
}

interface Donation {
  id: number;
  title: string;
  amount: number;
}

interface DonationData {
  id: number;
  amount: number;
  project_id: number; // この行
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { user_id, budget } = context.query;
  const projects = getProjects();
  return {
    props: {
      projects,
      budget: Number(budget),
      userId: Number(user_id),
    },
  };
};

export default function Home({ projects = [], budget, userId }: Props) {
  const [remainingBudget, setRemainingBudget] = useState(budget);
  // const [donations, setDonations] = useState(projects.map(project => ({ id: project.id, amount: 0 })));
  const [submittedDonations, setSubmittedDonations] = useState<Donation[]>([]);
  const [donations, setDonations] = useState(
    projects.map(project => {
      const existingDonation = submittedDonations.find(donation => Number(donation.id) === Number(project.id));
      return { id: project.id, amount: existingDonation ? existingDonation.amount : 0 };
    })
  );

  useEffect(() => {
    setDonations(
      projects.map(project => {
        const existingDonation = submittedDonations.find(donation => Number(donation.id) === Number(project.id));
        return { id: project.id, amount: existingDonation ? existingDonation.amount : 0 };
      })
    );
  }, [submittedDonations]);


  const handleDonationChange = (projectId: number, amount: number) => {
    const newDonations = donations.map(donation =>
      Number(donation.id) === projectId ? { ...donation, amount: amount } : donation
    );

    const totalDonations = newDonations.reduce((total, donation) => total + donation.amount, 0);

    if (totalDonations > budget) {
      alert('予算の上限に達しました');
      amount = budget - (totalDonations - amount);
    }

    setDonations(newDonations);
    setRemainingBudget(budget - totalDonations);
  };


  useEffect(() => {
    fetch(`/api/user_donations?user_id=${userId}`)
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        const submittedData = data
          .filter((donation: DonationData) => donation.amount > 0) // 寄付額が0より大きいものだけをフィルタリング
          .map((donation: DonationData) => {
            const project = projects.find(project => Number(project.id) == donation.project_id);
            return {
              title: project ? project.title : 'Unknown',
              amount: donation.amount
            };
          });
        setSubmittedDonations(submittedData);
        console.log("submited data", submittedData)
      });
  }, []);

  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="number"]');

    inputs.forEach((input) => {
      (input as HTMLInputElement).addEventListener('input', function (this: HTMLInputElement) {
        let total = 0;
        inputs.forEach((inputElement: Element) => {
          const input = inputElement as HTMLInputElement;
          total += Number(input.value);
        });
        const budgetElement = document.getElementById('budget');
        const budget = budgetElement ? Number((budgetElement as HTMLElement).innerText) : 0;
        const remainingBudget = budget - total;
        if (remainingBudget < 0) {
          alert('Total donations exceed the budget!');
          this.value = '';
        } else {
          setRemainingBudget(remainingBudget);
        }
      });
    });

  }, []);

  // const submitDonations = () => {
  //   const donationData = {
  //     user_id: userId,
  //     donations
  //   };

  //   fetch('/api/submit', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },

  //     body: JSON.stringify(donationData),
  //   }).then(response => {
  const submitDonations = () => {
    const method = submittedDonations.length > 0 ? 'PUT' : 'POST';
    const donationData = {
      user_id: userId,
      donations
    };

    fetch('/api/submit', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donationData),
    }).then(response => {
      if (response.ok) {
        console.log("donationData", donationData);
        // こんな感じのリクエストを送りたい
        // {
        //   "user_id": 1,
        //     "donations": [
        //       {
        //         "id": 1,
        //         "amount": 10
        //       },
        //       {
        //         "id": 3,
        //         "amount": 20
        //       }
        //     ]
        // }
        alert('送信成功!');
      } else {
        alert('送信失敗。再度試してください。');
      }
    }).catch(() => {
      alert('送信失敗。再度試してください。');
    });
  };

  return (
    <>
      <Spacer height="20px" />
      <Card>
        <CardHeader>
          <Heading size='md'>User Information: Scaned by QR Code</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing='4'>
            <Box>
              <Heading size='xs' textTransform='uppercase'>User ID</Heading>
              <Text pt='2' fontSize='sm'>{userId}</Text>
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>Your Budget</Heading>
              <Text pt='2' fontSize='sm'>{budget}</Text>
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>Your Remaining Budget</Heading>
              <Text pt='2' fontSize='sm'>{remainingBudget}</Text>
              <Spacer height="10px" />
              <Progress value={remainingBudget / budget * 100} />
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>Your Submitted Donations</Heading>
              {submittedDonations.map((donation, index) => (
                <Text pt='2' fontSize='sm' key={index}>{donation.title}: ${donation.amount}</Text>
              ))}
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Spacer height="20px" />
      <SimpleGrid spacing={4} templateColumns='repeat(3, 1fr)'>
        {projects.map((project, index) => (
          <Card key={index}>
            <CardHeader>
              <Heading size='md'>{project.title}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{project.description}</Text>
            </CardBody>
            <CardFooter>
              <NumberInput
                min={0}
                id={`donation_${project.id}`}
                onChange={(valueString) => {
                  const donationAmount = Number(valueString);
                  handleDonationChange(Number(project.id), donationAmount);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      <Spacer height="20px" />

      <Center position="relative" bottom="0" width="100%" p={4} bg="white">
        <Tooltip label="Click to submit your donations" placement="top">
          {/* {user_id}がすでに寄付しているかに基づいて出しわけ */}
          <Button
            id="submit"
            colorScheme={submittedDonations.length > 0 ? "red" : "blue"}
            onClick={() => {
              submitDonations();
            }}
          >
            {submittedDonations.length > 0 ? 'Update' : 'Submit'}
          </Button>
        </Tooltip>
      </Center>

    </>
  );
}
