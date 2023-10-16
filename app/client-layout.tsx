"use client";

import { SessionProvider } from "@/lib/client/session";
import { SWRConfig } from "swr";

const fetcher = ([url, params], session) => {
  if (url === null) return;
  const _params = {
    sessionId: session?.current?.token,
    property: session?.property?.propertyId,
    accessToken: session?.property?.accessToken,
    userIdentifier: session?.user?.identifier,
    ...params,
  };

  const _url = `/api/${url}?${new URLSearchParams(_params)}`;

  return fetch(_url).then((res) => {
    return res.json();
  });
};

export default function ClientLayout({ children, session }) {
  return (
    <SWRConfig value={{ fetcher: (d) => fetcher(d, session) }}>
      <SessionProvider session={session} isLoading={false}>
        {children}
      </SessionProvider>
    </SWRConfig>
  );
}
