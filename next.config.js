/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
