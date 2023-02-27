import Masonry from "@mui/lab/Masonry";
import type { Item } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { ItemCard } from "./ItemCard";
import { Toolbar } from "./Toolbar";

import {
  Box,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
} from "@mui/material";

/**
 * Renders a room based on the inventory data passed in the data object
 * @param {any} {data}
 * @param {any} {index}
 * @returns {any}
 */
export function RenderRoom({
  mutationUrl,
  data,
  index,
}: {
  mutationUrl: string;
  data: Item[];
  index: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(data);

  useEffect(() => {
    setItems(data);
  }, [data]);

  return (
    <Box key={index}>
      <Header
        room={index}
        itemCount={data.length}
        useAlias={router?.query?.custom?.toString()}
      />
      <Container>
        <Toolbar items={items} setItems={setItems} data={data} />
        <Box
          sx={{
            display: "flex",
            mr: {
              sm: -2,
            },
          }}
        >
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={{ xs: 0, sm: 2 }}>
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
                    background: global.user.darkMode
                      ? "hsla(240,11%,15%)"
                      : "rgba(200,200,200,.3)",
                    borderRadius: 5,
                    p: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{
                        mt: 1,
                        fontWeight: "700",
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
                <ItemCard item={item} mutationUrl={mutationUrl} />
              </div>
            ))}
          </Masonry>
        </Box>
      </Container>
    </Box>
  );
}
