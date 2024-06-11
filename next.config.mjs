/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/vault",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "session",
          },
        ],
      },
      {
        source: "/",
        destination: "/vault",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "session",
          },
        ],
      },
      {
        source: "/",
        destination: "/auth",
        permanent: false,
        missing: [
          {
            type: "cookie",
            key: "session",
          },
        ],
      },
      {
        source: "/vault",
        destination: "/auth",
        permanent: false,
        missing: [
          {
            type: "cookie",
            key: "session",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
