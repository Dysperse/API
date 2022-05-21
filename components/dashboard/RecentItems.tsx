import * as React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import CardContent from "@mui/material/CardContent";
import Item from "../../components/ItemPopup";
import useSWR from "swr";

const fetcher = (url, options) => fetch(url, options).then((res) => res.json());

export function RecentItems() {
  const url = "https://api.smartlist.tech/v2/items/list/";
  const { data, error } = useSWR(url, () =>
    fetcher(url, {
      method: "POST",
      body: new URLSearchParams({
        room: "null",
        limit: "7",
        token: global.session && global.session.accessToken
      })
    })
  );

  if (error) return <div>failed to load</div>;
  if (!data)
    return (
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={500}
        animation="wave"
        sx={{ borderRadius: "28px" }}
      />
    );

  return (
    <Card
      sx={{
        borderRadius: "28px",
        background: global.theme === "dark" ? "hsl(240, 11%, 20%)" : "#eee",
        boxShadow: 0,
        p: 1
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Recent items
        </Typography>
        {data.data.map((item: Object) => (
          <Item key={Math.random().toString()} variant="list" data={item} />
        ))}
      </CardContent>
    </Card>
  );
}
