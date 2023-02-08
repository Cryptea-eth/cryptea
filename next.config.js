/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MATIC_PRIVATE_KEY: process.env.MATIC_PRIVATE_KEY,
    MATIC_LINK: process.env.MATIC_LINK,
    POLYGONMATIC: process.env.POLYGONMATIC,
    AURORA_LINK: process.env.AURORA_LINK,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    APP_KEY: process.env.APP_KEY,
    UDCLIENT: process.env.UDCLIENT,
    KEY: process.env.KEY,
    UDREDIRECT: process.env.UDREDIRECT
  },
  images: {
    domains: ['assets.coingecko.com', 'coingecko.com']
  }
}

module.exports = nextConfig
