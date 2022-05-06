import * as React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import CardContent from "@mui/material/CardContent";
import { blueGrey } from "@mui/material/colors";
import useFetch from "react-fetch-hook";
import Item from "../../components/ItemPopup";

export function RecentItems() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/items/list/",
    {
      method: "POST",
      body: new URLSearchParams({
        room: "null",
        limit: "7",
        token: global.session && global.session.accessToken
      })
    }
  );
  return isLoading ? (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      height={500}
      animation="wave"
      sx={{ borderRadius: "28px" }}
    />
  ) : (
    <Card
      sx={{
        borderRadius: "28px",
        background: global.theme === "dark" ? "hsl(240, 11%, 20%)" : "#eee",
        boxShadow: 0,
        p: 1
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Recent items
        </Typography>
        {data.data.map((item: Object) => (
          <Item key={Math.random().toString()} variant="list" data={item} />
        ))}
      </CardContent>
    </Card>
  );
}
