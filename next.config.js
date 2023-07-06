/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    images: {
        domains: ['tailwindui.com', 'images.unsplash.com']
    }
}

module.exports = nextConfig
