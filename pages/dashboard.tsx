import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Head from "next/head";
import { RecentItems } from "../components/dashboard/RecentItems";
import { Lists } from "../components/dashboard/Lists";
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>
          Dashboard &bull;{" "}
          {global.session.property.houseName.replace(/./, (c) =>
            c.toUpperCase()
          )}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ mr: -2 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            <Paper>
              <RecentItems />
            </Paper>
            <Lists />
          </Masonry>
        </Box>
      </Container>
    </>
  );
}
