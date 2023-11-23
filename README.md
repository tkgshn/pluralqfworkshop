このリポジトリーは、Nov 9(Taipei time: GMT+8)に台湾で開催される[Funding the Commons Taipei](https://fundingthecommons.io/taipei-2023)で[taka (Shuansuke Takagi)](https://twitter.com/0xcommune)がホストする「Anti-Collusion QF Workshop」で利用するWebツールのコードを公開しています。

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

:::note warn
このツールは対面でのワークショップで利用することを想定しています。
:::

ワークショップ参加者は当日配布されるペルソナカードに書かれた QR コードをスキャンして、指定された予算を使って公共財プロジェクトに寄付するインタラクティブな体験を提供します。



## 機能

- **パラメータ付き URL によるプロファイル設定**: 参加者はペルソナカードに印刷された QR コードをスキャンして、寄付ページにアクセスします。各 QR コードはユニークなパラメータがついていて、それをもとにプロファイルを設定します
- **寄付シミュレーション**: 参加者は予算内で各プロジェクトに寄付を行い、その額を入力して submit します。
  - https://pluralqfworkshop-c03d589f9315.herokuapp.com/?user_id=10&budget=30
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

### Heroku CLIを利用してPostgresにログインする

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

