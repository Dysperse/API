import * as React from "react";
import useFetch from "react-fetch-hook";
import Skeleton from "@mui/material/Skeleton";
import { List } from "./List";

export function Lists() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/lists/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.ACCOUNT_DATA.accessToken
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  return isLoading ? (
    <>
      {[1, 1, 1, 1, 1].map((_) => (
        <Skeleton
          variant="rectangular"
          height={100}
          animation="wave"
          sx={{ mb: 1, borderRadius: "5px" }}
        />
      ))}
    </>
  ) : (
    <>
      {data.data.map((list: any) => (
        <List title={list.title} description={list.description} id={list.id} />
      ))}
    </>
  );
}
