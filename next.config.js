/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    transpilePackages: ['react-icons', 'antd', 'lodash']
}

module.exports = nextConfig
