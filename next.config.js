/**
 * @type {import('next').NextConfig}
 */
import withPlugins from "next-compose-plugins";
import withPWA from "next-pwa";

module.exports = withPlugins(
  [
    [
      withPWA({
        disable: process.env.NODE_ENV == "development",
        dest: "public",
      }),
    ],
  ],
  {
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: "/",
          destination: "/dashboard",
          permanent: true,
        },
      ];
    },
  }
);
