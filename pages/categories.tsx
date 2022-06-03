import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import { Puller } from "../components/Puller";
import { ItemCard } from "../components/rooms/ItemCard";

function ItemList({ name }: { name: string }) {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/items/categories/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.session.accessToken,
        category: name,
      }),
    }
  );
  useEffect(() => {
    setTimeout(
      () =>
        document
          .querySelector(`meta[name='theme-color']`)!
          .setAttribute(
            "content",
            global.theme === "dark" ? "hsl(240, 11%, 5%)" : "#808080"
          ),
      1
    );
  }, [isLoading]);
  return (
    <>
      {isLoading ? (
        <>
          {[...new Array(25)].map(() => (
            <Skeleton
              variant="rectangular"
              height={100}
              sx={{ mt: 2, borderRadius: 5 }}
            />
          ))}
        </>
      ) : (
        <>
          {data.data.map((item) => (
            <ItemCard displayRoom item={item} />
          ))}
        </>
      )}
    </>
  );
}

function Category({ name }: { name: string }) {
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    document
      .querySelector(`meta[name='theme-color']`)!
      .setAttribute(
        "content",
        open
          ? global.theme === "dark"
            ? "hsl(240, 11%, 5%)"
            : "#808080"
          : global.theme === "dark"
          ? "hsl(240, 11%, 10%)"
          : "#fff"
      );
  });

  return (
    <>
      <SwipeableDrawer
        open={open}
        swipeAreaWidth={0}
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            height: "70vh",
            pt: 1,
            maxHeight: "70vh",
            borderTopLeftRadius: "28px!important",
            borderTopRightRadius: "28px!important",
          },
        }}
      >
        <Box sx={{ pt: 1 }}>
          <Puller />
          <Typography
            variant="h5"
            sx={{ fontWeight: "800", textAlign: "center", mt: 4, mb: 2 }}
          >
            Items
          </Typography>
        </Box>
        <Box sx={{ px: 3, height: "100%", overflow: "scroll", pb: 3 }}>
          <ItemList name={name} />
        </Box>
      </SwipeableDrawer>
      <Card
        sx={{
          background:
            global.theme === "dark"
              ? "hsl(240, 11%, 20%)"
              : "rgba(200,200,200,.3)",
          borderRadius: 5,
          mt: 2,
        }}
      >
        <CardActionArea sx={{ px: 2, py: 0.3 }} onClick={() => setOpen(true)}>
          <CardContent>
            <Typography sx={{ fontWeight: "600" }} variant="h6">
              {name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default function Categories() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/items/categories/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.session.accessToken,
      }),
    }
  );
  return (
    <Container sx={{ mb: 3 }}>
      <Typography
        variant="h4"
        sx={{
          my: { xs: 12, sm: 4 },
          fontWeight: "800",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Categories
      </Typography>

      {isLoading ? (
        <>
          {[...new Array(25)].map(() => (
            <Skeleton
              variant="rectangular"
              height={100}
              sx={{ mt: 2, borderRadius: 5 }}
            />
          ))}
        </>
      ) : (
        <>
          {data.data.length === 0 && (
            <Card
              sx={{
                background: "rgba(200,200,200,.3)",
                borderRadius: 5,
                mt: 2,
                px: 2,
              }}
            >
              <CardContent>
                <Typography sx={{ fontWeight: "600", mt: 1 }}>
                  No categories - yet!
                </Typography>
              </CardContent>
            </Card>
          )}
          {data.data.map((category: string, key: number) => (
            <Category name={category} key={key} />
          ))}
        </>
      )}
    </Container>
  );
}
