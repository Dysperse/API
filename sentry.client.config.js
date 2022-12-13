import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay";

Sentry.init({
  dsn: "https://a2b8c2f3327043ee9b4a2667a29560a0@o4503985635655680.ingest.sentry.io/4503985637687296",

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  integrations: [new Replay()],
});
