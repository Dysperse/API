import * as React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import CardContent from "@mui/material/CardContent";
import { RecentItem } from "./RecentItem";
import useFetch from "react-fetch-hook";

export function RecentItems() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/items/list/",
    {
      method: "POST",
      body: new URLSearchParams({
        room: "null",
        limit: "7",
        token: ACCOUNT_DATA.accessToken
      })
    }
  );
  return isLoading ? (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      height={500}
      animation="wave"
      sx={{ borderRadius: "5px" }}
    />
  ) : (
    <Card>
      <CardContent>
        <Typography variant="h5">Recently edited</Typography>
        {data.data.map((list: Object) => (
          <RecentItem key={Math.random().toString()} item={list} />
        ))}
      </CardContent>
    </Card>
  );
}
