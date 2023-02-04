import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const getInfo = (
  path,
  initialParams,
  property,
  user,
  removeDefaultParams = false
) => {
  const params = removeDefaultParams
    ? {
        ...initialParams,
      }
    : {
        sessionId: user.token,
        property: property.propertyId,
        accessToken: property.accessToken,
        userIdentifier: user.identifier,
        ...initialParams,
      };

  return {
    params,
    url: `/api/${path}/?${new URLSearchParams(params).toString()}`,
  };
};

export function useApi(path, initialParams = {}, removeDefaultParams = false) {
  const { url } = useMemo(
    () =>
      getInfo(
        path,
        initialParams,
        global.property,
        global.user,
        removeDefaultParams
      ),
    [path, initialParams, removeDefaultParams, global.property, global.user]
  );
  const fetcher = (url) => fetch(url).then((res) => res.json());
  // preload(url, fetcher);

  const { data, error } = useSWR(url, fetcher);

  const [response, setResponse] = useState({
    data,
    url,
    loading: !error && !data,
    error: error,
  });

  useEffect(() => {
    setResponse({
      data,
      url,
      loading: !error && !data,
      error: error,
    });
  }, [data, error]);

  return response;
}

export async function fetchApiWithoutHook(
  path,
  initialParams = {},
  removeDefaultParams = false
) {
  const { url } = getInfo(
    path,
    initialParams,
    global.property,
    global.user,
    removeDefaultParams
  );
  const res = await fetch(url);
  return await res.json();
}
