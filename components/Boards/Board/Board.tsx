import {
  Box,
  Chip,
  Icon,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { useApi } from "../../../hooks/useApi";
import { colors } from "../../../lib/colors";
import { ErrorHandler } from "../../Error";
import { Column } from "./Column";
import { CreateColumn } from "./Column/Create";

function Renderer({ data, url, board }) {
  return (
    <>
      {data &&
        data.map((column) => (
          <Column
            key={column.id}
            tasks={
              /**
               * Return all tasks in boards, which contain columns containing tasks
               */
              data.map((column) => column.tasks).flat()
            }
            checkList={board.columns.length == 1}
            mutationUrl={url}
            boardId={board.id}
            column={column}
          />
        ))}
    </>
  );
}

export const Board = React.memo(function Board({ board }: any) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
  });

  return (
    <Box
      sx={{
        pb: 2,
        ml: { sm: -1 },
      }}
    >
      <Box
        sx={{
          position: { sm: "sticky" },
          top: "0",
          borderBottom: "1px solid rgba(200,200,200,.3)",
          background: "rgba(255,255,255,.7)",
          zIndex: 1,
          p: 2,
          pt: 3,
          px: 4,
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            lineHeight: 1.5,
            flexGrow: 1,
            letterSpacing: 0.15,
          }}
        >
          <span>{board.name}</span>
          <Box
            sx={{
              display: "flex",
              pt: 0.5,
              gap: 1,
              alignItems: "center",
            }}
          >
            <Chip
              size="small"
              label={
                (data ? data.map((column) => column.tasks).flat().length : 0) +
                " tasks"
              }
            />
            <Chip
              size="small"
              sx={{
                color: "success.main",
                background: colors.green["50"],
              }}
              label={
                (data
                  ? data
                      .map((column) => column.tasks)
                      .flat()
                      .filter((task) => task.completed).length
                  : 0) + " completed"
              }
            />
          </Box>
        </Typography>
        <IconButton
          disableRipple
          sx={{
            transition: "none",
            background: colors[themeColor][50] + "!important",
            "&:hover": {
              background: colors[themeColor][100] + "!important",
            },
            ml: "auto",
          }}
        >
          <Icon>filter_list</Icon>
        </IconButton>
        <IconButton
          disableRipple
          sx={{
            transition: "none",
            background: colors[themeColor][50] + "!important",
            "&:hover": {
              background: colors[themeColor][100] + "!important",
            },
            ml: "auto",
          }}
        >
          <Icon>more_horiz</Icon>
        </IconButton>
      </Box>
      <Box sx={{ overflowX: "scroll", mt: 4 }}>
        {error && (
          <ErrorHandler error="An error occured while trying to fetch your tasks" />
        )}
        <Box
          sx={{
            maxWidth: "100vw",
            pl: data && board.columns.length === 1 ? 0 : 4,
            pr: data ? 0 : 4,
          }}
        >
          <Box
            sx={{
              ...(board.columns.length !== 1
                ? {
                    display: "flex",
                    gap: "10px",
                  }
                : {
                    mt: -3,
                  }),
            }}
          >
            <Renderer data={data} url={url} board={board} />
            {data ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mx: 2,
                  flexDirection: "column",
                }}
              >
                {board.columns.length !== 1 && data.length < 5 && (
                  <CreateColumn id={board.id} mutationUrl={url} />
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflow: "hidden",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
