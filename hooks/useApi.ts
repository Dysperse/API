import { useEffect, useMemo, useState } from "react";
import useSWR, { preload } from "swr";

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
        ...initialParams,
        property: property.propertyId,
        accessToken: property.accessToken,
        userIdentifier: user.identifier,
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
  preload(url);

  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

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
