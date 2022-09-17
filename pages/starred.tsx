import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { ItemCard } from "../components/rooms/ItemCard";
import type { Item } from "../types/item";

/**
 * Items component to load inventory
 */
function Items() {
  const url =
    "/api/inventory/starred-items?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    }).toString();
  const { error, data }: any = useSWR(url, () =>
    fetch(url, { method: "POST" }).then((res) => res.json())
  );
  if (error) return <>An error occured, please try again later</>;
  return !data ? (
    <>
      {[...new Array(15)].map(() => {
        let height = Math.random() * 400;
        if (height < 100) height = 100;
        return (
          <Paper key={Math.random().toString()} sx={{ p: 0 }} elevation={0}>
            <Skeleton
              variant="rectangular"
              height={height}
              animation="wave"
              sx={{ mb: 1, borderRadius: "28px" }}
            />
          </Paper>
        );
      })}
    </>
  ) : (
    <>
      {data.data.map((item: Item) => (
        <Paper
          sx={{ boxShadow: 0, p: 0 }}
          key={(Math.random() + Math.random()).toString()}
        >
          <ItemCard item={item} displayRoom={false} />
        </Paper>
      ))}
    </>
  );
}

/**
 * Top-level component for the starred page.
 */
export default function Render() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          my: { xs: 12, sm: 4 },
          fontWeight: "700",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Starred
      </Typography>
      <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
        <Items />
      </Masonry>
    </Box>
  );
}
