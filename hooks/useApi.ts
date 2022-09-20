import React from "react";
import useSWR from "swr";
import type { ApiResponse } from "../types/client";

const getInfo = (path, initialParams, property) => {
  const params = {
    ...initialParams,
    property: property.propertyId,
    accessToken: property.accessToken,
  };

  return {
    params,
    url: `/api/${path}/?${new URLSearchParams(params).toString()}`,
  };
};
export function useApi(path: string, initialParams: any = {}): ApiResponse {
  const { url } = getInfo(path, initialParams, global.property);

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

export async function fetchApiWithoutHook(
  path: string,
  initialParams: any = {}
): Promise<any> {
  const { url } = getInfo(path, initialParams, global.property);

  const res = await fetch(url);
  return await res.json();
}
