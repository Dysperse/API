import useFetch from "react-fetch-hook";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import Paper from "@mui/material/Paper";
import { ItemCard } from "../components/rooms/ItemCard";

function Items() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/items/starred/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.ACCOUNT_DATA.accessToken.toString()
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  return isLoading ? (
    <>
      {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_) => (
        <Skeleton
          height={100}
          animation="wave"
          sx={{ mb: 2, borderRadius: 2 }}
        />
      ))}
    </>
  ) : (
    <>
      {data.data.map(
        (
          item: {
            id: number;
            lastUpdated: string;
            amount: string;
            sync: string;
            title: string;
            categories: string;
            note: string;
            star: number;
            room: string;
          },
          id: any
        ) => {
          return (
            <Paper sx={{ boxShadow: 0, p: 0 }} key={id.toString()}>
              <ItemCard item={item} />
            </Paper>
          );
        }
      )}
    </>
  );
}

export default function Render() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography sx={{ mb: 2 }} variant="h5">
        Starred items
      </Typography>
      <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
        <Items />
      </Masonry>
    </Box>
  );
}
