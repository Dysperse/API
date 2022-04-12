import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useFetch from "react-fetch-hook";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import CardContent from "@mui/material/CardContent";
import { GenerateListItem } from "./GenerateListItem";

export function ListItems({
  parent,
  title,
  emptyImage,
  emptyText
}: {
  parent: any;
  title: any;
  emptyImage: any;
  emptyText: any;
}) {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/lists/fetch/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.ACCOUNT_DATA.accessToken,
        parent: parent
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  return isLoading ? (
    <Skeleton
      height={200}
      animation="wave"
      variant="rectangular"
      sx={{ borderRadius: "5px" }}
    />
  ) : (
    <Card sx={{ mb: 1, width: "100%" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        {data.data.map((list: Object) => (
          <GenerateListItem {...list} />
        ))}
        {data.data.length === 0 && (
          <Box sx={{ textAlign: "center" }}>
            <img alt="" src={emptyImage} />
            <Typography sx={{ display: "block" }} variant="h6">
              No items?!
            </Typography>
            <Typography sx={{ display: "block" }}>{emptyText}</Typography>
            <Typography sx={{ display: "block" }} variant="caption">
              PRO TIP: Hit the "+" icon to create an item
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
