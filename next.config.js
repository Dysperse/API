// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const { withSentryConfig } = require("@sentry/nextjs");

const withPWA = require("next-pwa")({
  dest: "public",
  reloadOnOnline: false,
  dynamicStartUrl: false,
  cacheOnFrontEndNav: true,
  maximumFileSizeToCacheInBytes: 5,
});

const moduleExports = {
  ...withPWA({
    images: {
      unoptimized: true,
    },
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: "/",
          destination: "/zen",
          permanent: false,
        },
        // {
        //   source: "/home",
        //   destination: "/tasks",
        //   permanent: false,
        // },
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
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

if (process.env.NODE_ENV == "development") {
  module.exports = moduleExports;
} else {
  module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
}
