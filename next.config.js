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
          source: "/zen",
          destination: "/",
          permanent: false,
        },
        {
          source: "/api/user",
          destination: "/api/session",
          permanent: false,
        },
        {
          source: "/api/property/tasks/agenda",
          destination: "/api/property/tasks/perspectives",
          permanent: false,
        },
        {
          source: "/onboarding",
          destination: "/",
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
          destination: "/tasks/perspectives/days",
          permanent: false,
        },
        {
          source: "/tasks/agenda/:path*",
          destination: "/tasks/perspectives/:path*",
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
