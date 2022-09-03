import { useState } from "react";
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
    transition: "transform .1s!important",
    boxShadow: "none!important",
    "&:active": {
      transform: "scale(0.95)",
      transition: "none !important",
    },
  };
  const activeTabStyles = {
    background: colors[themeColor]["800"] + "!important",
    color: "#fff",
  };
  const [activeTab, setActiveTab] = useState("tasks");

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
          {["Productivity", "Tasks", "Recent", "Tips"].map((item) => (
            <Chip
              key={item}
              label={item}
              onClick={() => setActiveTab(item.toLowerCase())}
              sx={{
                ...styles,
                ...(activeTab === item.toLowerCase() && activeTabStyles),
              }}
            />
          ))}
        </Box>
        <Box sx={{ mr: -2 }}>
          <Masonry columns={1} spacing={2}>
            {activeTab === "productivity" && <Lists />}
            {activeTab === "tasks" && <Lists />}
            {activeTab === "recent" && <RecentItems />}
            {activeTab === "tips" && <RecentItems />}
          </Masonry>
        </Box>
      </Container>
    </>
  );
}
