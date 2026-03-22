/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['firebasestorage.googleapis.com'],
    },
    env: {
      NEXT_PUBLIC_CLIENT_TRACE: 'fd-d9c8b7a6e5f4d3c2b1a0f9e8d7c6b5a4'
    }
  };
  
  module.exports = nextConfig;