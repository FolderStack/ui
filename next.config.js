/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['via.placeholder.com'],
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
