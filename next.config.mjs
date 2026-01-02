/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    async rewrites() {
        return [
            {
                source: '/api/proxy/:path*',
                destination: 'https://arcmat-api.vercel.app/api/:path*',
            },
        ];
    },
};

export default nextConfig;
