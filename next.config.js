/**
 * @type {import('next').NextConfig}
 */

const withPWA = require('next-pwa')({
  dest: "public",
  reloadOnOnline: false,
  dynamicStartUrl: false,
  cacheOnFrontEndNav: true
})
// const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  // Your existing module.exports
  ...withPWA({
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: "/",
          destination: "/home",
          permanent: true,
        },
        {
          source: "/home",
          destination: "/tasks",
          permanent: false,
        },
        {
          source: "/dashboard",
          destination: "/home",
          permanent: true,
        },
        {
          source: "/signup",
          destination: "/auth/signup",
          permanent: true,
        },
      ];
    },
  }),
  // sentry: {
  //   hideSourceMaps: true,
  // },
};

// const sentryWebpackPluginOptions = {
//   silent: true, // Suppresses all logs
// };

module.exports = moduleExports
// module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);