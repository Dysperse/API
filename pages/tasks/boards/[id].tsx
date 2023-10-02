import { ErrorHandler } from "@/components/Error";
import { Board } from "@/components/Tasks/Board";
import { TasksLayout } from "@/components/Tasks/Layout";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, CircularProgress, Icon, IconButton } from "@mui/material";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { session } = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const { id } = router?.query;
  const shareToken = router?.query?.share;

  return (
    <TasksLayout
      navbarRightContent={
        <>
          <IconButton
            onClick={() => router.push(`/tasks/boards/edit/${id}`)}
            sx={{
              "&:active": {
                transform: "scale(0.9)",
              },
              color: palette[9],
              background: addHslAlpha(palette[3], 0.8),
              transition: "transform .1s",
            }}
          >
            <Icon sx={{ transform: "scale(1.1)" }} className="outlined">
              settings
            </Icon>
          </IconButton>
        </>
      }
    >
      {id && <BoardContainer id={id} shareToken={shareToken} />}
    </TasksLayout>
  );
};

export default Dashboard;
