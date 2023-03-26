import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay";

Sentry.init({
  dsn: "https://a2b8c2f3327043ee9b4a2667a29560a0@o4503985635655680.ingest.sentry.io/4503985637687296",
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  ignoreErrors: ["ResizeObserver loop limit exceeded"],
  integrations: [new Replay()],
});
