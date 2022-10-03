/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ALCHEMY_ID: process.env.ALCHEMY_ID,
  },
};

module.exports = nextConfig;
