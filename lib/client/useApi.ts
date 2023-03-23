/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useSession } from "../../pages/_app";

const getInfo = (
  path: string,
  initialParams: any,
  property: any,
  user: any,
  removeDefaultParams: boolean = false
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

export interface ApiResponse {
  /**
   * Data returned from the API
   */
  data: any;
  /**
   * URL can be used for either debugging or passed as a parameter for the SWR `mutate()` function
   */
  url: string;
  /**
   * Is the request still loading?
   */
  loading: boolean;
  /**
   * Returns if there was an error in fetching the request
   */
  error: null | any;
  /**
   * Function to actually fetch the url from the API. (Required for the SWR `preload()` function)
   */
  fetcher: any;
}

/**
 *
 * @param path - The path of the API request
 * @param initialParams - Any parameters you want to send to the server goes here
 * @param removeDefaultParams - Change this to `true` if you want to prevent the default tokens and parameters from being passed to the server
 * @returns @interface ApiResponse
 */
export function useApi(
  path: string,
  initialParams = {},
  removeDefaultParams = false
): ApiResponse {
  let session = useSession() || { property: "", user: "" };
  const { property, user } = session;

  const { url } = useMemo(
    () => getInfo(path, initialParams, property, user, removeDefaultParams),
    [path, initialParams, property, user, removeDefaultParams]
  );

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(url, fetcher);

  const [response, setResponse] = useState<ApiResponse>({
    data,
    url,
    loading: !error && !data,
    error: error,
    fetcher: fetcher,
  });

  useEffect(() => {
    setResponse({
      data,
      url,
      loading: !error && !data,
      error: error,
      fetcher: fetcher,
    });
  }, [data, error]);

  return response;
}

/**
 * Use the raw API without the SWR library
 * @param path - The path of the API request
 * @param initialParams - Any parameters you want to send to the server goes here
 * @param removeDefaultParams - Change this to `true` if you want to prevent the default tokens and parameters from being passed to the server
 * @returns Promise<ApiResponse>
 */
export async function useRawApi(
  path,
  initialParams = {},
  removeDefaultParams = false
): Promise<ApiResponse> {
  const session = useSession();

  const { url } = getInfo(
    path,
    initialParams,
    session.property,
    session?.user,
    removeDefaultParams
  );
  const res = await fetch(url);
  return await res.json();
}
