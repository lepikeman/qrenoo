const nextConfig = {
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