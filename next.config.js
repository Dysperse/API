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
      withPWA({
        pwa: {
          dest: "public"
        }
      }),
      withTM({
        // custom config goes here
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
