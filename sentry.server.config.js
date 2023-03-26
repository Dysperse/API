import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    "https://a2b8c2f3327043ee9b4a2667a29560a0@o4503985635655680.ingest.sentry.io/4503985637687296",
  tracesSampleRate: 1.0,
});
