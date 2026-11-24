/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@xflasar/ui', '@xflasar/types'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'media.steampowered.com',
      },
      {
        protocol: 'https',
        hostname: 'shared.cloudflare.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.akamai.steamstatic.com',
      },
    ],
  },
}

export default nextConfig
