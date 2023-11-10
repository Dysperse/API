const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontendNav: true,
  reloadOnOnline: false
});

const moduleExports = {
  ...withPWA({
    images: {
      unoptimized: true,
    },
    reactStrictMode: true, 
    swcMinify: true,
    reactStrictMode: true,
    transpilePackages: ['@mui/x-charts'],
    async redirects() {
      return [
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
