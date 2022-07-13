/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");

module.exports = withPlugins(
  [
    [
      withPWA({
        pwa: {
          disable: process.env == "development",
          dest: "public"
        }
      })
    ]
  ],
  {
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: "/",
          destination: "/dashboard",
          permanent: true
        }
      ];
    }
  }
);
