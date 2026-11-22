/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@xflasar/types', '@xflasar/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
    ],
  },
}

export default nextConfig
