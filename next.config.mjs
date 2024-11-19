/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.google.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
