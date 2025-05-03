/** @type {import('next').NextConfig} */

const securityHeaders = [
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'on'
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload'
    },
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block',
    },
    {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN'
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff'
    },  
];

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
    SOLANA_DEVNET: process.env.SOLANA_DEVNET,
    HOST: process.env.HOST,
    TRON_TESTNET_SOLIDITY: process.env.TRON_TESTNET_SOLIDITY,
    TRON_TESTNET: process.env.TRON_TESTNET,
    TRON_MAINNET: process.env.TRON_MAINNET,
    TRON_MAINNET_SOLIDITY: process.env.TRON_MAINNET_SOLIDITY,
    TRON: process.env.TRON,
    WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
  },
  images: {
    domains: ['assets.coingecko.com', 'coingecko.com', 'coin-images.coingecko.com']
  },
  async headers() {
    return [
      {
          source: '/:path*',
          headers: securityHeaders
      }
    ];
  }
}

module.exports = nextConfig
