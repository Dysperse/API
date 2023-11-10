"use client";

export const fetcher = ([url, params], session) => {
  if (url === null) return;
  const _url = `/api/${url}?${new URLSearchParams(params)}`;
  return fetch(_url, {
    headers: new Headers({
      Authorization: `Bearer ${session?.current?.token}`,
    }),
  }).then((res) => {
    return res.json();
  });
};
