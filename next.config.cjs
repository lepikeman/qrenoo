const nextConfig = {
    compress: true,
  experimental: {
    optimizeCss: true,
    legacyBrowsers: false,
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lgxcufxbvvedftlcxoqp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatar/**',
        search: '',
      },
      
    ],
    domains: ['cdn.pixabay.com'],
  },
};
module.exports = nextConfig;