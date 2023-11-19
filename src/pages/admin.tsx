import { useEffect, useState } from 'react';

interface AdminDonation {
    project_id: string;
    title: string;
    total_amount: number;
    donors: string;
}

export default function Admin() {
    const [donations, setDonations] = useState<AdminDonation[]>([]);

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
            // ここでエラーメッセージを設定するなど、適切なエラーハンドリングを行います。
        });

    return (
        <div className="container">
            <h1>Admin Page</h1>
            <table className="donations-table">
                <thead>
                    <tr>
                        <th>Project ID</th>
                        <th>Title</th>
                        <th>Total Amount</th>
                        <th>Donors</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map((donation, index) => (
                        <tr key={index}>
                            <td>{donation.project_id}</td>
                            <td>{donation.title}</td>
                            <td>{donation.total_amount}</td>
                            <td>{donation.donors}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>{`
            .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 15px;
        }
        .donations-table {
          width: 100%;
          border-collapse: collapse;
        }
        .donations-table th, .donations-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .donations-table th {
          background-color: #f2f2f2;
          color: black;
        }
      `}</style>
        </div>
    );
}
