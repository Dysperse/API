/**
 * @type {import('next').NextConfig}
 */

const withPWA = require('next-pwa')({
  // disable: process.env.NODE_ENV == "development",
  dest: "public",
  reloadOnOnline: false
})

module.exports = withPWA({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/home",
        permanent: true,
      },
    ];
  },
})