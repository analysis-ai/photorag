/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stphotoragai963326273849.blob.core.windows.net'
      }
    ]
  }
};

export default nextConfig;
