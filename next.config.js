const { withSentryConfig } = require("@sentry/nextjs");

const withPWA = require("next-pwa")({
  dest: "public",
  reloadOnOnline: false,
  dynamicStartUrl: false,
  cacheOnFrontEndNav: true,
  maximumFileSizeToCacheInBytes: 1000000,
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
        {
          source: "/api/user",
          destination: "/api/session",
          permanent: false,
        },
        {
          source: "/signup",
          destination: "/auth/signup",
          permanent: true,
        },
        {
          source: "/login",
          destination: "/auth",
          permanent: true,
        },
        {
          source: "/tasks",
          destination: "/tasks/agenda/week",
          permanent: false,
        },
        {
          source: "/discord",
          destination: "https://discord.gg/fvngmDzh77",
          permanent: true,
        },
      ];
    },
  }),
};

const sentryWebpackPluginOptions = {
  hideSourceMaps: true,
  silent: true,
};

if (process.env.NODE_ENV == "development") {
  module.exports = moduleExports;
} else {
  module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
}
