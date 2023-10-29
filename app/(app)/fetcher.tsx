"use client";

export const fetcher = ([url, params], session) => {
  if (url === null) return;
  const _params = {
    sessionId: session?.current?.token,
    property: session?.property?.propertyId,
    accessToken: session?.property?.accessToken,
    userIdentifier: session?.user?.identifier,
    ...params,
  };

  const _url = `/${url}?${new URLSearchParams(_params)}`;
  return fetch(_url, {
    headers: new Headers({
      Authorization: `Bearer ${session?.current?.token}`,
    }),
  }).then((res) => {
    return res.json();
  });
};
