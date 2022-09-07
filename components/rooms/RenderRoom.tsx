import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { decode } from "js-base64";
import * as colors from "@mui/material/colors";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Item } from "../../types/item";
import { Header } from "./Header";
import { ItemCard } from "./ItemCard";
import { Toolbar } from "./Toolbar";

export function RenderRoom({ data, index }: any) {
  const router = useRouter();
  const [items, setItems] = useState(data);
  const [updateBanner, setUpdateBanner] = useState(false);

  useEffect(() => {
    if (data !== items) {
      setUpdateBanner(false);
      setItems(data);
    }
  }, [data, items]);
  global.setUpdateBanner = setUpdateBanner;

  return (
    <Container key={index} sx={{ mt: 4 }}>
      <Header
        room={index}
        itemCount={data.length}
        useAlias={router.query.custom}
      />
      <Toolbar
        room={router.query.custom ? decode(index).split(",")[0] : index}
        alias={router.query.custom ? decode(index).split(",")[1] : index}
        items={items}
        setItems={setItems}
        data={data}
      />
      {updateBanner ===
        (router.query.custom ? decode(index).split(",")[0] : index) && (
        <Box
          sx={{
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 15%)"
                : colors[themeColor]["100"],
            color: colors[themeColor][900],
            borderRadius: 5,
            p: 3,
            mb: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>New items have been added to this room.</Typography>
          <Button
            sx={{
              ml: "auto",
              borderWidth: "2px!important",
              borderRadius: 4,
              whiteSpace: "nowrap",
            }}
            variant="outlined"
            onClick={() => {
              setUpdateBanner(false);
              fetch(
                "/api/property/inventory/list?" +
                  new URLSearchParams({
                    property: global.property.propertyId,
                    accessToken: global.property.accessToken,
                    room: router.query.custom
                      ? decode(index).split(",")[0]
                      : index,
                  }),
                {
                  method: "POST",
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  setItems([]);
                  setTimeout(() => {
                    setItems(res);
                  }, 10);
                });
            }}
          >
            Show changes
            <span
              className="material-symbols-rounded"
              style={{ marginLeft: "10px" }}
            >
              refresh
            </span>
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          mr: {
            sm: -2,
          },
        }}
      >
        <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
          {items.length === 0 ? (
            <Paper
              sx={{
                boxShadow: 0,
                p: 0,
                width: "calc(100% - 15px)!important",
                textAlign: "center",
                mb: 2,
              }}
              key={"_noItems"}
            >
              <Card
                sx={{
                  mb: 2,
                  background: "rgba(200,200,200,.3)",
                  borderRadius: 5,
                  p: 3,
                }}
              >
                <CardContent>
                  <picture>
                    <img
                      alt="No items found"
                      src="https://i.ibb.co/kh7zpKS/tokyo-designing-a-web-page-using-various-design-shapes.png"
                      style={{ width: "200px", maxWidth: "100%" }}
                    />
                  </picture>
                  <Typography
                    variant="h5"
                    sx={{
                      mt: 1,
                    }}
                  >
                    No items found
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      gap: "10px",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    Try clearing any filters.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          ) : null}

          {items.map((item: Item, key: number) => (
            <div key={key.toString()}>
              <ItemCard item={item} />
            </div>
          ))}
        </Masonry>
      </Box>
    </Container>
  );
}
