import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { colors } from "../lib/colors";import Container from "@mui/material/Container";
import Head from "next/head";
import { useState } from "react";
import { Lists } from "../components/dashboard/Lists";
import { RecentItems } from "../components/dashboard/RecentItems";
import { Recipes } from "../components/dashboard/Recipes";
import { Tips } from "../components/dashboard/Tips";

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
    background:
      colors[themeColor][global.user.darkMode ? 100 : 800] + "!important",
    color: global.user.darkMode ? "#000" : "#fff",
  };
  const [activeTab, setActiveTab] = useState("lists");

  return (
    <>
      <Head>
        <title>
          Dashboard &bull;{" "}
          {global.property.profile.name.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ pb: 3, pl: 1 }}>
          {["Recent", "Lists", "Tips", "Recipes"].map((item) => (
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
        {activeTab === "lists" && <Lists />}
        {activeTab === "recent" && <RecentItems />}
        {activeTab === "tips" && <Tips />}
        {activeTab === "recipes" && <Recipes />}
      </Container>
    </>
  );
}
