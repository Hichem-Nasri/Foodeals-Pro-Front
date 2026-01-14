/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'api.dicebear.com',
      'localhost:8080',
    ], // TODO: Remove when /me endpoint is implemented
  },
}

export default nextConfig
