/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");

const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
]);


module.exports = withPlugins(
  [
    [
      withTM({
        // custom config goes here
      }),
      withPWA({
        pwa: {
        //   disable: process.env.NODE_ENV === "development",
          mode: "production",
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
