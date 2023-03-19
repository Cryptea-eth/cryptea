/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MATIC_PRIVATE_KEY: process.env.MATIC_PRIVATE_KEY,
    MATIC_LINK: process.env.MATIC_LINK,
    POLYGONMATIC: process.env.POLYGONMATIC,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    APP_KEY: process.env.APP_KEY,
    OPTIMISM_MAINNET: process.env.OPTIMISM_MAINNET,
    UDCLIENT: process.env.UDCLIENT,
    KEY: process.env.KEY,
    JSON: process.env.JSON,
    UDREDIRECT: process.env.UDREDIRECT,
    SOLANA_MAINNET: process.env.SOLANA_MAINNET,
    SOLANA_DEVNET: process.env.SOLANA_DEVNET
  },
  images: {
    domains: ['assets.coingecko.com', 'coingecko.com']
  }
}

module.exports = nextConfig
