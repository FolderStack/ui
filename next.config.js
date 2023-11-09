/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**'
            }
        ]
    },
    experimental: {
        serverActions: true
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/folder',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
