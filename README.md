# PluralQF Workshop

still in wip

## 概要

この repo は Funding the Commons Taipei で、PluralQF Workshop を行うのに使用するツールです。ワークショップ参加者は当日配布されるペルソナカードに書かれた QR コードをスキャンして、指定された予算を使って公共財プロジェクトに寄付するインタラクティブな体験を提供します。参加者は指定されたそれぞれのペルソナに基づいた予算内で寄付を行い、各プロジェクトへの寄付額は/admin ページ確認できます。

## 機能

- **パラメータ付き URL によるプロファイル設定**: 参加者はペルソナカードに印刷された QR コードをスキャンして、寄付ページにアクセスします。各 QR コードはユニークなパラメータがついていて、それをもとにプロファイルを設定します
- **寄付シミュレーション**: 参加者は予算内で各プロジェクトに寄付を行い、その額を入力して submit します。
  - http://localhost:3000/?user_id=2&budget=30
  - [![Image from Gyazo](https://i.gyazo.com/94e6d4280937eb49cf8a150ee1f4d5ee.png)](https://gyazo.com/94e6d4280937eb49cf8a150ee1f4d5ee)
- **集計ページ**: /admin ページで各プロジェクトの寄付額と参加人数の集計結果を確認できます。
  - http://localhost:3000/admin.html
  - [![Image from Gyazo](https://i.gyazo.com/61091b2e25ab7840fb022c1b8aa77e13.png)](https://gyazo.com/61091b2e25ab7840fb022c1b8aa77e13)

## 技術スタック

- HTML/TypeScript/JavaScript
- Node.js
- Express
- MarinaDB

## ファイル構成

- [`admin.html`](https://github.com/tkgshn/pluralqfworkshop/blob/main/public/admin.html): 集計ページの HTML ファイル。
- [`admin.js`](https://github.com/tkgshn/pluralqfworkshop/blob/main/public/admin.js): 集計ページの JavaScript ファイル。
- [`budgetControl.js`](https://github.com/tkgshn/pluralqfworkshop/blob/main/public/budgetControl.js): 寄付金額の制御を行う JavaScript ファイル。
- [`submitDonations.js`](https://github.com/tkgshn/pluralqfworkshop/blob/main/public/submitDonations.js): 寄付の送信を行う JavaScript ファイル。

## ワークショップ当日の使用方法

1. ペルソナカードに印刷された QR コードをスキャンします。
2. 寄付ページで予算内で寄付を行い、submit ボタンを押します。
3. 管理者は/admin ページで寄付の集計結果を確認します。

heroku config:get DATABASE_URL -a pluralqfworkshop > .env.local

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
