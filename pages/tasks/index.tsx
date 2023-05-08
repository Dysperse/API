import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { TasksLayout } from "../../components/Boards/Layout";
import { useApi } from "../../lib/client/useApi";

const loader = () => (
  <Box
    sx={{
      width: "100%",
      height: { xs: "calc(100vh - var(--navbar-height) - 55px)", sm: "100vh" },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

export default function Dashboard() {
  const router = useRouter();
  const { data, url, error } = useApi("property/boards");
  useEffect(() => {
    if (data) {
      const pinnedBoardExists = data.find((board) => board.pinned);
      let url = "/tasks/agenda/week";

      if (pinnedBoardExists) url = `/tasks/boards/${pinnedBoardExists.id}`;

      router.push(url);
    }
  }, [data, router]);
  return <TasksLayout>{loader}</TasksLayout>;
}
