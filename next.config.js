const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  async headers() {
    return [
      {
        // Routes this applies to
        source: "/(.*)",
        // Headers
        headers: [
          // Allow for specific domains to have access or * for all
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
            // DOES NOT WORK
            // value: process.env.ALLOWED_ORIGIN,
          },
          // Allows for specific methods accepted
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          // Allows for specific headers accepted (These are a few standard ones)
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/api/user",
        destination: "/api/session",
        permanent: false,
      },
      // redirect /published-redirect/* to https://app.dysperse.com/p/*
      {
        source: "/published-redirect/:path*",
        destination: "https://app.dysperse.com/p/:path*",
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
        source: "/web\\+dysperse\\:/:path*",
        destination: "/:path*",
        permanent: false,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/fvngmDzh77",
        permanent: true,
      },
    ];
  },
};

if (process.env.NODE_ENV == "development") {
  module.exports = moduleExports;
} else {
  module.exports = withSentryConfig(moduleExports, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "dysperse",
    project: "api",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  });
}
