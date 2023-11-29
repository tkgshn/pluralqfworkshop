This repository publishes the code for the web tool used in the "Anti-Collusion QF Workshop" hosted by [taka (Shuansuke Takagi)](https://twitter.com/0xcommune) at [Funding the Commons Taipei](https://fundingthecommons.io/taipei-2023) held in Taiwan on Nov 9 (Taipei time: GMT+8).

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/e75f6cc5d5a84d318995b00376b37dd4" title="FtC Taipei: Anti-Collusion QF Workshop" allowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;" data-ratio="1.7777777777777777"></iframe>

# Overview of Anti-Collusion QF Workshop

This workshop introduces Plural QF as a more multidimensional and collusion-resistant version of the funding distribution mechanism known as Quadratic Funding (QF).

**Introduction**

Introduction to QF and its use cases.

- Concept and importance of QF
- The mechanism of QF for funding distribution and its mathematical foundations
- Attack vectors on QF
    - Countermeasures

**Simulation**

Participants experience both QF and Plural QF by role-playing as donors.

- Distribute [Persona Cards] with details like age, hobbies, gender, etc., each having an amount that the persona can use.
- Simulate donations in a fictional city with various public good projects based on the persona received.
    - Group discussions for participants to express opinions from the perspective of their persona.
- Compare the amounts received by each project in regular QF vs Plural QF.
    - Calculations for regular QF (not considering donor identity).
    - Calculations for Plural QF, clustering by age, then by gender, income, etc.

**Discussion**
- Participants discuss which method they think is fairer and more effective based on the simulation results.
- Exchange opinions on the importance of vote numbers and diversity from a political-philosophical perspective.

**Recap**
- Discuss with participants where each method is effective or could cause issues.
- Participants share insights gained through the simulation and discussion.
- Solicit ideas and proposals for improving QF and Plural QF.
- Provide resources for further research and practice on QF and Plural QF.

# How to Use the Tool

*This tool is intended for use in face-to-face workshops.*

Workshop participants will scan the QR code printed on the persona cards distributed on the day to offer an interactive experience of donating to public good projects using the specified budget.

## Features

- **Profile setup via URL with parameters**: Participants scan the QR code printed on the persona cards to access the donation page. Each QR code has unique parameters for setting up profiles.
- **Donation simulation**: Participants make donations within the budget to various projects and submit the amounts.
  - https://pluralqfworkshop-c03d589f9315.herokuapp.com/?user_id=8&budget=50&age=89
  [![Image from Gyazo](https://i.gyazo.com/b7067014be7bbe793960a4ab68a089e8.png)](https://gyazo.com/b7067014be7bbe793960a4ab68a089e8)
- **Aggregation page**: Check the aggregated results of donations and participant numbers on the /admin page.
  - https://pluralqfworkshop-c03d589f9315.herokuapp.com/admin
  [![Image from Gyazo](https://i.gyazo.com/1bc9107ce59749c36a2441da3c0524e3.png)](https://gyazo.com/1bc9107ce59749c36a2441da3c0524e3)

## Tech Stack

[![Image from Gyazo](https://i.gyazo.com/773a05c8764d8899152bba8b97a3063a.png)](https://gyazo.com/773a05c8764d8899152bba8b97a3063a)

- TypeScript
- Next.js
- Postgres
- Heroku

## File Structure

**API**
- admin.ts: API for displaying the /admin page.
- donate.ts: API for retrieving donation data saved in the DB.
- qf-calculation.ts: API for performing QF calculations.
- pluralqf-calculation.ts: API for performing Plural QF calculations.
- project.ts: API for retrieving project data saved in JSON.
- user_donations.ts: API for retrieving user donation data saved in the DB.

**Page**
- admin.tsx: /admin page.
- index.tsx: Donation page.

Here's the translation of the remaining part of the README into English, maintaining the format:


## How to Use on the Day of the Workshop

1. Scan the QR code printed on the persona card.
2. Make donations within the budget on the donation page and press the submit button.
3. The administrator can check the aggregated donation results on the /admin page.


# About Development

## Environment Setup

### Reflecting DATABASE_URL in the Local Environment
When hosted on Heroku, the DATABASE_URL changes over time. It is automatically overwritten in the Config Vars on Heroku for remote environments, but needs to be manually overwritten in .env.local for local environments.

Use the following command to generate (if the file doesn't exist) .env.local and write DATABASE_URL into it:

```
heroku config:get DATABASE_URL -a pluralqfworkshop > .env.local
```

### (Optional: Login to Postgres using Heroku CLI)

```
heroku pg:psql postgresql-opaque-08560 --app pluralqfworkshop
```

### Installing Packages
```
npm install
```
Update based on the error message if the version doesn't match.

### Starting Next.js

```bash
npm run dev
```

After this, you will be prompted to open [http://localhost:3000](http://localhost:3000), but accessing this URL without parameters will result in the following error:
   >Unhandled Runtime Error
   > Error: Hydration failed because the initial UI does not match what was rendered on the server.
   > Warning: Did not expect server HTML to contain the text node "NaN" in .
   > See more info here: https://nextjs.org/docs/messages/react-hydration-error

Instead, access the donation page ([http://localhost:3000/?user_id=8&budget=50&age=89](http://localhost:3000/?user_id=8&budget=50&age=89)) or the admin page ([http://localhost:3000/admin](http://localhost:3000/admin)).

## Author

twitter: [0xtkgshn](https://twitter.com/0xcommune)

---


このリポジトリーは、Nov 9(Taipei time: GMT+8)に台湾で開催される[Funding the Commons Taipei](https://fundingthecommons.io/taipei-2023)で[taka (Shuansuke Takagi)](https://twitter.com/0xcommune)がホストする「Anti-Collusion QF Workshop」で利用するWebツールのコードを公開しています。

[![Image from Gyazo](https://i.gyazo.com/e1431a6f1cbe155d3d508f36d2d0babe.png)](https://gyazo.com/e1431a6f1cbe155d3d508f36d2d0babe)

# Anti-Collusion QF Workshopの概要

このワークショップではQuadratic Funding（QF）という資金分配メカニズムをテーマに、より多次元的かつ談合などにも強いバージョンとしてPlural QFについて紹介します。


**導入**

QFについての紹介と、ユースケースについて紹介します。

- QFの概念とその重要性
- QFを利用した資金分配のメカニズムとその数学的基礎
- QFの攻撃ベクトル
 	- 対策方法

**シュミレーション**

QFとPlural QFの両方を寄付者になりきって体験してもらう。

- 参加者に年齢や趣味、性別...などを記載した[ペルソナカード]を配布する。各カードには「そのペルソナが利用できる額」も書かれている。
- 仮想の都市を想定し、いくつかの公共財プロジェクトがある中で「（自分が受け取ったカードに書かれている）ペルソナが寄付しそうなもの」をシュミレーションして寄付を行う
 	- グループディスカッションをして、参加者がペルソナの視点から意見を述べる
- 各プロジェクトが得た金額を通常のQF vs Plural QFで比較する
    - 通常のQF（寄付者のアイデンティティを考慮しない）バージョンの計算
    - Plural QFとして、年齢でクラスタリングした場合の計算
            その後、男女で、収入で...などさまざまなクラスタリングが可能

**ディスカッション**
- 参加者に、シミュレーションの結果に基づいて、どちらの方法がより公平で効果的だと思うかを議論してもらいます。
- 政治哲学的な観点から、票数と多様性の重要性についての意見を交換します。

**Recap**
- 参加者と一緒に、どのような状況でそれぞれが有効か、または問題が生じる可能性があるかを議論します。
- 参加者に、シミュレーションの体験やディスカッションを通じて得た洞察を共有してもらいます。
- QFとPlural QFを改善するためのアイデアや提案を募集します。
- QFとPlural QFに関するさらなる研究や実践のためのリソースを提供します


# ツールの利用方法

*このツールは対面でのワークショップで利用することを想定しています。*

ワークショップ参加者は当日配布されるペルソナカードに書かれた QR コードをスキャンして、指定された予算を使って公共財プロジェクトに寄付するインタラクティブな体験を提供します。



## 機能

- **パラメータ付き URL によるプロファイル設定**: 参加者はペルソナカードに印刷された QR コードをスキャンして、寄付ページにアクセスします。各 QR コードはユニークなパラメータがついていて、それをもとにプロファイルを設定します
- **寄付シミュレーション**: 参加者は予算内で各プロジェクトに寄付を行い、その額を入力して submit します。
  - https://pluralqfworkshop-c03d589f9315.herokuapp.com/?user_id=8&budget=50&age=89
  [![Image from Gyazo](https://i.gyazo.com/b7067014be7bbe793960a4ab68a089e8.png)](https://gyazo.com/b7067014be7bbe793960a4ab68a089e8)
- **集計ページ**: /admin ページで各プロジェクトの寄付額と参加人数の集計結果を確認できます。
  - https://pluralqfworkshop-c03d589f9315.herokuapp.com/admin
  [![Image from Gyazo](https://i.gyazo.com/1bc9107ce59749c36a2441da3c0524e3.png)](https://gyazo.com/1bc9107ce59749c36a2441da3c0524e3)

## 技術スタック

[![Image from Gyazo](https://i.gyazo.com/773a05c8764d8899152bba8b97a3063a.png)](https://gyazo.com/773a05c8764d8899152bba8b97a3063a)

- TypeScript
- Next.js
- Postgres
- Heroku

## ファイル構成

**API**
- admin.ts: /adminページを表示するのに使うAPI
- donate.ts: DBに保存されている寄付データ取得API
- qf-calclation.ts: QFの計算を行うAPI
- pluralqf-calclation.ts: Plural QFの計算を行うAPI
- project.ts: JSONに保存されているプロジェクトデータ取得API
- user_donations.ts: DBに保存されているユーザーの寄付データ取得API

**Page**
- admin.tsx: /adminページ
- index.tsx: 寄付ページ


## ワークショップ当日の使用方法

1. ペルソナカードに印刷された QR コードをスキャンします。
2. 寄付ページで予算内で寄付を行い、submit ボタンを押します。
3. 管理者は/admin ページで寄付の集計結果を確認します。

# 開発について

## 環境設定

### ローカル環境にDATABASE_URLを反映する
Herokuにホストしている場合、DATABASE_URLは時間経過によって変更されます。リモート環境ではHeroku上のConfig Varsに自動的に上書きされますが、ローカル環境では.env.localに手動で上書きする必要があります。

以下のコマンドを使うことで、（ファイルがない場合は）.env.localを生成し、DATABASE_URLを書き込むことができます。

```
heroku config:get DATABASE_URL -a pluralqfworkshop > .env.local
```

### （任意: Heroku CLIを利用してPostgresにログインする）

```
heroku pg:psql postgresql-opaque-08560 --app pluralqfworkshop
```

### パッケージのインストール
```
npm install
```
バージョンが合わない場合は、エラー文をもとにアップデートしてください

### Next.jsの起動

```bash
npm run dev
```

この後、[http://localhost:3000](http://localhost:3000)を開くように表示されますが、このURLはパラメータがついてないのでアクセスすると以下のエラーが発生します:
   >Unhandled Runtime Error
   > Error: Hydration failed because the initial UI does not match what was rendered on the server.
   > Warning: Did not expect server HTML to contain the text node "NaN" in .
   > See more info here: https://nextjs.org/docs/messages/react-hydration-error

代わりに、寄付ページ（[http://localhost:3000/?user_id=8&budget=50&age=89](http://localhost:3000/?user_id=8&budget=50&age=89)）や、管理者ページ（[http://localhost:3000/admin](http://localhost:3000/admin)）にアクセスしてください。


## Author

twitter: [0xtkgshn](https://twitter.com/0xcommune)

