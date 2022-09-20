import useSWR from "swr";
import React from "react";
import type { ApiResponse } from "../types/client";

export function useApi(path: string, initialParams: any = {}): ApiResponse {
  const params = {
    ...initialParams,
    property: global.property.propertyId,
    accessToken: global.property.accessToken,
  };
  const url = `/api/${path}/?${new URLSearchParams(params)}`;

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
