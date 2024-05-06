const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Set your origin
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
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
