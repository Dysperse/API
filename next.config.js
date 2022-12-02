/**
 * @type {import('next').NextConfig}
 */

const withPWA = require('next-pwa')({
  dest: "public",
  reloadOnOnline: false,
  dynamicStartUrl: false,
  cacheOnFrontEndNav: true
})

module.exports = withPWA({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tasks",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/tasks",
        permanent: false,
      },
      {
        source: "/signup",
        destination: "/auth/signup",
        permanent: true,
      },

      {
        source: "/discord",
        destination: "https://discord.gg/fvngmDzh77",
        permanent: true,
      },
      {
        source: "/feedback",
        destination: "https://my.smartlist.tech/canny-auth?companyID=6306f3586e9c6244c28c1d1e&redirect=https%3A%2F%2Ffeedback.smartlist.tech%2F",
        permanent: true,
      },
    ];
  },
})