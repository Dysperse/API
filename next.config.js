// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require("@sentry/nextjs");

const withPWA = require("next-pwa")({
  dest: "public",
  reloadOnOnline: false,
  dynamicStartUrl: false,
  cacheOnFrontEndNav: true,
});

const moduleExports = {
  ...withPWA({
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
          permanent: true,
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
          destination:
            "https://my.dysperse.com/canny-auth?companyID=6306f3586e9c6244c28c1d1e&redirect=https%3A%2F%2Ffeedback.dysperse.com%2F",
          permanent: true,
        },
      ];
    },
  }),
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
