"use client";
/* eslint-disable */

const getInfo = (
  path: null | string,
  initialParams: any,
  property: any,
  user: any,
  removeDefaultParams: boolean = false,
  current: any
) => {
  const params = removeDefaultParams
    ? {
        ...initialParams,
      }
    : {
        sessionId: current.token,
        property: property.propertyId,
        accessToken: property.accessToken,
        userIdentifier: user.identifier,
        ...initialParams,
      };

  return {
    params,
    url: `/${path}/?${new URLSearchParams(params).toString()}`,
  };
};

export interface ApiResponse {
  /**
   * `Promise<ApiResponse>`
   *
   * Data returned from the API
   */
  data: any;
  mutate: any;
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
}

/**
 * Use the raw API without the SWR library
 * @param path - The path of the API request
 * @param initialParams - Any parameters you want to send to the server goes here
 * @param removeDefaultParams - Change this to `true` if you want to prevent the default tokens and parameters from being passed to the server
 * @returns Promise<ApiResponse>
 */
export async function fetchRawApi(
  session,
  path,
  initialParams = {},
  removeDefaultParams = false
) {
  const { url } = getInfo(
    path,
    initialParams,
    session.property,
    session?.user,
    removeDefaultParams,
    session?.current
  );
  const res = await fetch("/api/" + url);
  return await res.json();
}
