import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import Masonry from "@mui/lab/Masonry";
import {
  Box,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { Item } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { ItemCard } from "./ItemCard";
import { Toolbar } from "./Toolbar";

/**
 * Renders a room based on the inventory data passed in the data object
 * @param {any} {data}
 * @param {any} {index}
 * @returns {any}
 */
export function RenderRoom({
  mutationUrl,
  items,
  room,
}: {
  mutationUrl: string;
  items: Item[];
  room: string | string[] | undefined;
}) {
  const [_items, setItems] = useState(items);

  useEffect(() => setItems(items), [items]);
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const header = (
    <Header room={room} itemCount={items.length} mutationUrl={mutationUrl} />
  );
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(session.themeColor, isDark);

  return (
    <Box
      sx={{
        maxWidth: "100vw",
      }}
    >
      {!isMobile && header}
      <Container>
        <Toolbar items={items} setItems={setItems} data={_items} />
      </Container>
      {isMobile && header}
      <Container>
        <Box
          sx={{
            display: "flex",
            mr: -2,
          }}
        >
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            {_items.length === 0 ? (
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
                    background: palette[2],
                    borderRadius: 5,
                    p: 3,
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Image
                      src="/images/noItems.png"
                      width={256}
                      height={256}
                      style={{
                        ...(isDark && {
                          filter: "invert(100%)",
                        }),
                      }}
                      alt="No items found"
                    />
                    <Typography
                      variant="h5"
                      sx={{
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

            {_items.map((item: Item) => (
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
