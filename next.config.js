/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Product images are uploaded to Vercel Blob.
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' }
    ]
  }
}

module.exports = nextConfig
