import * as React from "react";
import useFetch from "react-fetch-hook";
import Skeleton from "@mui/material/Skeleton";
import { List } from "./List";

export function Lists() {
  const { isLoading, data } = useFetch("https://api.smartlist.tech/v2/lists/", {
    method: "POST",
    body: new URLSearchParams({
      token: global.ACCOUNT_DATA.accessToken
    }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  return isLoading ? (
    <div>
      <Skeleton height={90} animation="wave" sx={{ mb: 1 }} />
    </div>
  ) : (
    <>
      {data.data.map((list: Object) => (
        <List {...list} />
      ))}
    </>
  );
}
