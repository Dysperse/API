import { ErrorHandler } from "@/components/Error";
import { Board } from "@/components/Tasks/Board";
import { TasksLayout } from "@/components/Tasks/Layout";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

const BoardContainer = ({ id, shareToken }) => {
  const { data, mutate, error } = useSWR([
    "property/boards",
    { id, shareToken },
  ]);

  return (
    <>
      {error && (
        <ErrorHandler error="An error occured while trying to get this board's information" />
      )}
      {data ? (
        <Board mutate={mutate} board={data[0]} />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const { id } = router?.query;
  const shareToken = router?.query?.share;
  const [open, setOpen] = useState(false);

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      {id && <BoardContainer id={id} shareToken={shareToken} />}
    </TasksLayout>
  );
};

export default Dashboard;
