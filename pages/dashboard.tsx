import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
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
          {global.property.propertyName.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ p: 1 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Hey, {global.user.name.split(" ")[0]}.
          </Typography>
        </Box>
        <Box sx={{ mr: -2 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            <Lists />
            <Paper>
              <RecentItems />
            </Paper>
          </Masonry>
        </Box>
      </Container>
    </>
  );
}
