import useFetch from "react-fetch-hook";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { ItemCard } from "../components/rooms/ItemCard";
import Masonry from "@mui/lab/Masonry";

function Items() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/trash/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  return isLoading ? (
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
    </>
  );
}

export default function Render() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography sx={{ mb: 2 }} variant="h5">
        Trash
      </Typography>
      <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
        <Items />
      </Masonry>
    </Box>
  );
}
