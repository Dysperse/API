import * as React from "react";
import Typography from "@mui/material/Typography";
import useFetch from "react-fetch-hook";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import CardContent from "@mui/material/CardContent";
import { RecentItem } from "./RecentItem";

export function RecentItems() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/items/list/",
    {
      method: "POST",
      body: new URLSearchParams({
        room: "null",
        limit: "7",
        token: global.ACCOUNT_DATA.accessToken
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  return isLoading ? (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      height={500}
      animation="wave"
    />
  ) : (
    <Card>
      <CardContent>
        <Typography variant="h5">Recently edited</Typography>
        {data.data.map((list: Object) => (
          <RecentItem data={list} />
        ))}
      </CardContent>
    </Card>
  );
}
