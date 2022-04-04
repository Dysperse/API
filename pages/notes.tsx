import useFetch from "react-fetch-hook";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Masonry from "@mui/lab/Masonry";
import Typography from "@mui/material/Typography";
import NoteModal from "../components/NoteModal";

function Note({
  title,
  banner,
  id
}: {
  title: string;
  banner?: string;
  id: number;
}) {
  return (
    <Paper key={Math.random().toString()}>
      <Card>
        <NoteModal title={title} banner={banner} id={id}>
          <CardActionArea>
            {banner ? (
              <CardMedia>
                <img
                  src={banner}
                  width="100%"
                  alt="Note banner"
                  draggable="false"
                />
              </CardMedia>
            ) : null}
            <CardContent>
              <Typography variant="h5">{title}</Typography>
            </CardContent>
          </CardActionArea>
        </NoteModal>
      </Card>
    </Paper>
  );
}

function NoteList() {
  const { isLoading, data }: any = useFetch(
    "https://api.smartlist.tech/v2/notes/",
    {
      method: "POST",
      body: new URLSearchParams({
        token: global.ACCOUNT_DATA.accessToken
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  return isLoading ? (
    <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
      <Skeleton height={90} animation="wave" sx={{ mb: 1 }} />
    </Masonry>
  ) : (
    <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
      {data.data.map((list: any) => (
        <Note title={list.title} banner={list.banner} id={list.id} />
      ))}
    </Masonry>
  );
}

export default function Notes() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography sx={{ mb: 3 }} variant="h5">
        Notes
      </Typography>
      <NoteList />
    </Box>
  );
}
