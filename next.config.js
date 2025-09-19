/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-cloudflare-account-id.r2.cloudflarestorage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
