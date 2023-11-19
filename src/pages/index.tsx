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
  Container,
  Progress,
  Stack,
  StackDivider,
  Box,
  Spacer,
  Center,
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
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="number"]'));
    const donations = inputs.map(input => ({
      id: input.id.replace('donation_', ''),
      amount: Number(input.value)
    }));

    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id');

    fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, donations }),
    }).then(response => {
      if (response.ok) {
        alert('送信成功!');
      } else {
        alert('送信失敗。再度試してください。');
      }
    }).catch(() => {
      alert('送信失敗。再度試してください。');
    });
  };

  return (

    <Container maxW="container.xl" centerContent>
      <Box maxW="container.md" mx="auto">
      <Card>
        <CardHeader>
          <Heading size='md'>User Information</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing='4'>
            <Box>
              <Heading size='xs' textTransform='uppercase'>ID</Heading>
              <Text pt='2' fontSize='sm'>{userId}</Text>
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>Budget</Heading>
              <Text pt='2' fontSize='sm'>{budget}</Text>
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>Remaining Budget</Heading>
              <Text pt='2' fontSize='sm'>{remainingBudget}</Text>
              <Spacer height="10px" />
              <Progress value={remainingBudget / budget * 100} />
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <Spacer height="20px" />
      {/* <Progress value={remainingBudget / budget * 100} /> */}
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
                  setRemainingBudget(budget - donationAmount);
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

      </Box>
      <Center position="fixed" bottom="0" width="100%" p={4} bg="white">
        <Button
          id="submit"
          colorScheme="blue"
          onClick={() => {
            submitDonations();
          }}
        >
          Submit
        </Button>
      </Center>
      </Container>
    // </div>
  );
}

// この例では、サーバーサイドでのデータ取得方法は省略していますが、
// 実際には getServerSideProps または getStaticProps を使用してデータを取得することになります。
