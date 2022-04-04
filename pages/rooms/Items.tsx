import * as React from "react";
import { useRouter } from "next/router";
import useFetch from "react-fetch-hook";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { ItemCard } from "./ItemCard";

export function Items() {
  const router = useRouter();
  const { index } = router.query;

  const { isLoading, data } = useFetch(
    "https://api.smartlist.tech/v2/items/list/",
    {
      method: "POST",
      body: new URLSearchParams({
        room: index.toString(),
        token: global.ACCOUNT_DATA.accessToken.toString()
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  return isLoading ? (
    <>
      {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_) => (
        <Skeleton height={100} variant="wave" sx={{ mb: 2, borderRadius: 2 }} />
      ))}
    </>
  ) : (
    <>
      {data.data.map(
        (item: {
          id: number;
          lastUpdated: string;
          amount: string;
          sync: string;
          title: string;
          categories: string;
          note: string;
          star: number;
          room: string;
        }) => (
          <Paper
            sx={{ boxShadow: 0, p: 0 }}
            key={(Math.random() + Math.random()).toString()}
          >
            <ItemCard item={item} />
          </Paper>
        )
      )}
      {data.data.length == 0 ? (
        <Paper
          sx={{
            boxShadow: 0,
            p: 0,
            width: "calc(100% - 15px)!important",
            textAlign: "center",
            mb: 2
          }}
          key={(Math.random() + Math.random()).toString()}
        >
          <Card
            sx={{
              mb: 2
            }}
          >
            <CardContent>
              <img
                src="https://ouch-cdn2.icons8.com/XBzKv4afS9brUYd2rl02wYqlGS8RRQ59aTS-49vo_s4/rs:fit:256:266/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNjE2/L2FmYmNiNTMyLWY5/ZjYtNGQxZC1iZjE0/LTYzMTExZmJmZWMw/ZC5zdmc.png"
                alt="No items..."
                style={{ width: "300px", maxWidth: "90vw" }}
              />
              <Typography
                variant="h5"
                sx={{
                  mt: 1
                }}
              >
                No items yet...
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  display: "inline-flex",
                  gap: "10px",
                  alignItems: "center",
                  mt: 1
                }}
              >
                Hit the <EditIcon /> icon to create an item.{" "}
              </Typography>
            </CardContent>
          </Card>
        </Paper>
      ) : null}
    </>
  );
}
