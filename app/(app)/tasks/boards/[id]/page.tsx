"use client";
import { Board } from "@/app/(app)/tasks/boards/[id]/Board";
import { ErrorHandler } from "@/components/Error";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Skeleton,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { TaskNavbar } from "../../navbar";

const BoardContainer = ({ id, shareToken }) => {
  const router = useRouter();
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const { data, mutate, error } = useSWR(["space/tasks/boards", { id }]);

  return (
    <>
      <TaskNavbar
        title={data ? data[0].name : <Skeleton width={100} animation="wave" />}
        subTitle={data ? "Board" : <Skeleton width={50} animation="wave" />}
        rightContent={
          data ? (
            <IconButton
              onClick={() => router.push(`/tasks/boards/${data[0].id}/edit`)}
              sx={{
                background: addHslAlpha(palette[4], 0.6),
                "&:active": { background: addHslAlpha(palette[4], 0.9) },
              }}
            >
              <Icon className="outlined">settings</Icon>
            </IconButton>
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )
        }
      />

      {error && (
        <ErrorHandler
          callback={mutate}
          error="An error occured while trying to get this board's information"
        />
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
