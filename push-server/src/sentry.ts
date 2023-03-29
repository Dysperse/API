export const SentryInit = async () => {
  const url =
    "https://sentry.io/api/0/monitors/794c0af4-04c1-42c6-99e9-f6b6c563b012/checkins/";

  const { id } = (await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "DSN https://a2b8c2f3327043ee9b4a2667a29560a0@o4503985635655680.ingest.sentry.io/4503985637687296",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "in_progress" }),
  })
    .then((response) => {
      
      return response.json();
    })
    .catch((err) => {
      console.error(err);
    })) as any;
  return id;
};

export const SentryFinish = async (id: string) => {
  const url =
    "https://sentry.io/api/0/monitors/794c0af4-04c1-42c6-99e9-f6b6c563b012/checkins/" +
    id;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "DSN https://a2b8c2f3327043ee9b4a2667a29560a0@o4503985635655680.ingest.sentry.io/4503985637687296",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "ok", duration: 3000 }),
  })
    .then((response) => {
      
      return response.json();
    })
    .catch((err) => {
      console.error(err);
    });
};
