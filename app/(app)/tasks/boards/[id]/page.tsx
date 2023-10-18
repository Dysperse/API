"use client";
import { Board } from "@/app/(app)/tasks/boards/[id]/Board";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Skeleton,
} from "@mui/material";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { TaskNavbar } from "../../navbar";

const BoardContainer = ({ id, shareToken }) => {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const { data, mutate, error } = useSWR([
    "property/boards",
    { id, shareToken, includeTasks: true },
  ]);

  return (
    <>
      <TaskNavbar
        title={data ? data[0].name : <Skeleton width={100} animation="wave" />}
        subTitle={data ? "Board" : <Skeleton width={50} animation="wave" />}
        rightContent={
          <IconButton sx={{ background: palette[4] }}>
            <Icon className="outlined">settings</Icon>
          </IconButton>
        }
      />

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
  const params = useParams();
  const { id, share } = params as any;

  return id && <BoardContainer id={id} shareToken={share} />;
};

export default Dashboard;
