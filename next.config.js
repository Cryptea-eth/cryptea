/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MATIC_PRIVATE_KEY: process.env.MATIC_PRIVATE_KEY,
    MATIC_LINK: process.env.MATIC_LINK,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    APP_KEY: process.env.APP_KEY,
    KEY: process.env.KEY
  }
}

module.exports = nextConfig
