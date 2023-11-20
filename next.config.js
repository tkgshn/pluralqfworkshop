/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: 'postgres://ksbypbyyyvcixb:cb1b9a4b0dcb12211674a4a879cad6d362e8d8b4155e274739f933c44f74b275@ec2-44-213-228-107.compute-1.amazonaws.com:5432/d5g25pt80nb9l3',
    NEXT_PUBLIC_VERCEL_URL: 'http://localhost:3000',
  },
}

module.exports = nextConfig
