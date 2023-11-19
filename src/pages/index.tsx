import { useState, useEffect } from 'react';
import { getProjects, Project } from "./api/projects";
import { GetServerSideProps } from 'next';

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
    });
  };

  return (
    <>
      <h1>Your id is</h1>
      <p>{userId}</p>
      <h1>Your budget is</h1>
      <p><span id="budget">{budget}</span></p>
      <h1>Projects</h1>
      <style jsx>{`
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
        }
      `}</style>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Donation</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>
                 <input
                  type="number"
                  min="0"
                  id={`donation_${project.id}`}
                  // 下記のonChangeイベントはdonationのstateを更新するロジックを追加する場所です
                  onChange={(event) => {
                    const donationAmount = Number(event.target.value);
                    setRemainingBudget(budget - donationAmount);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Remaining budget</h1>
      <p><span id="remaining_budget">{remainingBudget}</span></p>
      {/* 下記のボタンクリックイベントは寄付を処理するロジックを追加する場所です */}
      <button id="submit" onClick={() => {
        submitDonations();
      }}>Submit</button>
    </>
  );
}

// この例では、サーバーサイドでのデータ取得方法は省略していますが、
// 実際には getServerSideProps または getStaticProps を使用してデータを取得することになります。
