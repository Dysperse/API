/** @type {import('next').NextConfig} */
/*const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
]);
*/
const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");

module.exports = withPlugins(
  [
    [
      // withTM(),
      withPWA({
        pwa: {
          disable: process.env == "development",
          dest: "public"
        }
      })
    ]
  ],
  {
    // experimental: {
    //   runtime: 'experimental-edge',
    // },
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
