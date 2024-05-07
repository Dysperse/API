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
            value: "GET, POST, PUT, DELETE, OPTIONS",
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

const sentryWebpackPluginOptions = {
  hideSourceMaps: true,
  silent: true,
};

if (process.env.NODE_ENV == "development") {
  module.exports = moduleExports;
} else {
  module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
}
