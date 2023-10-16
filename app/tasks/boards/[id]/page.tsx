"use client";
import { Board } from "@/app/tasks/boards/[id]/Board";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { Box, CircularProgress } from "@mui/material";
import { useParams } from "next/navigation";
import useSWR from "swr";

const BoardContainer = ({ id, shareToken }) => {
  const { data, mutate, error } = useSWR([
    "property/boards",
    { id, shareToken, includeTasks: true },
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
  const { session } = useSession();

  const params = useParams();
  const { id, share } = params as any;

  return id && <BoardContainer id={id} shareToken={share} />;
};

export default Dashboard;
