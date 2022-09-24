import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { decode } from "js-base64";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Item } from "@prisma/client";
import { Header } from "./Header";
import { ItemCard } from "./ItemCard";
import { Toolbar } from "./Toolbar";

/**
 * Renders a room based on the inventory data passed in the data object
 * @param {any} {data}
 * @param {any} {index}
 * @returns {any}
 */
export function RenderRoom({ data, index }: { data: Item[]; index: string }) {
  const router = useRouter();
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

  return (
    <Container key={index} sx={{ mt: 4 }}>
      <Header
        room={index}
        itemCount={data.length}
        useAlias={router?.query?.custom?.toString()}
      />
      <Toolbar
        room={router.query.custom ? decode(index).split(",")[0] : index}
        alias={router.query.custom ? decode(index).split(",")[1] : index}
        items={items}
        setItems={setItems}
        data={data}
      />
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

          {items.map((item: Item) => (
            <div key={item.id.toString()}>
              <ItemCard item={item} />
            </div>
          ))}
        </Masonry>
      </Box>
    </Container>
  );
}
