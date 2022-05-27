import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { ItemCard } from "../components/rooms/ItemCard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

function Items() {
  const url = "https://api.smartlist.tech/v2/trash/";
  const { data, error }: any = useSWR(url, () =>
    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken,
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then((res) => res.json())
  );

  if (error) {
    return (
      <>
        Yikes! An error occured while loading your trash. Try reloading this
        page
      </>
    );
  }
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
      {data.data.map((item: any) => (
        <Paper
          sx={{ boxShadow: 0, p: 0 }}
          key={(Math.random() + Math.random()).toString()}
        >
          <Card
            sx={{ background: "rgba(200,200,200,.3)", borderRadius: "28px" }}
          >
            <CardContent>
              <ItemCard item={item} displayRoom={true} />
              <Button
                sx={{
                  float: "right",
                  boxShadow: 0,
                  m: 0.5,
                  mb: 2,
                  borderRadius: 9,
                }}
                variant="contained"
              >
                Delete
              </Button>
              <Button
                sx={{
                  float: "right",
                  boxShadow: 0,
                  m: 0.5,
                  mb: 2,
                  borderRadius: 9,
                }}
                variant="outlined"
              >
                Restore
              </Button>
            </CardContent>
          </Card>
        </Paper>
      ))}
    </>
  );
}

export default function Render() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          my: { xs: 12, sm: 4 },
          fontWeight: "800",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Trash
      </Typography>
      <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
        <Items />
      </Masonry>
    </Box>
  );
}
