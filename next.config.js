const fs = require('fs');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_VERCEL_URL: 'http://localhost:3000',
  },
}


// Heroku Postgressの認証情報（DATABASE_URL）は時間経過で変化するので、変わり次第`heroku config:get DATABASE_URL -a pluralqfworkshop > .env.local`で更新しなければいけない
// 上記コマンドを実行すると、.env.localにDATABASE_URLが書き込まれる
// ので、この関数では、.env.localが存在する場合は、その内容を読み込んで、nextConfig.env.DATABASE_URLに設定している
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const databaseUrl = fs.readFileSync(envLocalPath, 'utf-8').trim();
  nextConfig.env.DATABASE_URL = databaseUrl;
}

module.exports = nextConfig;
