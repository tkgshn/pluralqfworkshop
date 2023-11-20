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
  const [donations, setDonations] = useState(projects.map(project => ({ id: project.id, amount: 0 })));


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

  const submitDonations = () => {

    const donationData = {
      user_id: userId,
      donations
    };

    fetch('/api/submit', {
      method: 'POST',
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
          <Button
            id="submit"
            colorScheme="blue"
            onClick={() => {
              submitDonations();
            }}
          >
            Submit
          </Button>
        </Tooltip>
      </Center>

    </>
  );
}
