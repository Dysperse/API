import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Head from "next/head";
import { RecentItems } from "../components/dashboard/RecentItems";
import { Lists } from "../components/dashboard/Lists";
import * as colors from "@mui/material/colors";

export default function Dashboard() {
  const styles = {
    mr: 1,
    px: 0.7,
    boxShadow: "0!important",
  };
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
        <Box sx={{ pb: 3, pl: 1 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Hey, {global.user.name.split(" ")[0]}.
          </Typography>
          <Chip label="Productivity" onClick={() => true} sx={styles} />
          <Chip
            label="Tasks"
            onClick={() => true}
            sx={{
              ...styles,
              background: colors[themeColor]["800"] + "!important",
              color: "#fff",
            }}
          />
          <Chip label="Recent" onClick={() => true} sx={styles} />
          <Chip label="Tips" onClick={() => true} sx={styles} />
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
