import React from "react";
import useSWR from "swr";
import type { ApiResponse } from "../types/client";

/**
 * Creates the url for the API endpoint
 */
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
/**
 * @description A custom hook to fetch data from the API with SWR.
 * @param path The path to the API endpoint
 * @param initialParams The parameters to pass to the API
 * @returns The data from the API
 */
export function useApi(
  path: string,
  initialParams: {
    [key: string]: string | number | boolean;
  } = {},
  removeDefaultParams = false
): ApiResponse {
  const { url } = getInfo(
    path,
    initialParams,
    global.property,
    global.user,
    removeDefaultParams
  );

  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );
  const [returned, setReturned] = React.useState<ApiResponse>({
    data,
    url,
    loading: !error && !data,
    error: error,
  });

  React.useEffect(() => {
    setReturned({
      data,
      url,
      loading: !error && !data,
      error: error,
    });
  }, [url, data, error]);

  return returned;
}

/**
 * Without SWR
 */
export async function fetchApiWithoutHook(
  path: string,
  initialParams: {
    [key: string]: string | number | boolean;
  } = {},
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
