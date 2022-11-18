import Box from "@mui/material/Box";
import Head from "next/head";
import { TasksLayout } from "../components/Boards/TasksLayout";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>
          Tasks &bull;{" "}
          {global.property.profile.name.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Box
        sx={{
          pt: 4,
          pl: 4,
          pr: { xs: 4, sm: 0 },
        }}
      >
        <TasksLayout />
      </Box>
    </>
  );
}
