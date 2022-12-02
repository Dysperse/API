import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import React from "react";
import { useApi } from "../../hooks/useApi";
import { ErrorHandler } from "../error";
import { Column } from "./Column";
import { CreateColumn } from "./CreateColumn";

function Renderer({ data, url, board }) {
  return (
    <>
      {data &&
        data.map((column) => (
          <Column
            checkList={board.columns.length == 1}
            mutationUrl={url}
            boardId={board.id}
            column={column}
          />
        ))}
    </>
  );
}

export const Board = React.memo(function ({ board }: any) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
  });

  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your tasks" />
      )}
      <Box
        sx={{
          maxWidth: "100vw",
        }}
      >
        <Box
          sx={{
            ...(board.columns.length !== 1
              ? {
                  display: "flex",
                  gap: "10px",
                  overflowX: "scroll",
                }
              : {
                  mt: -3,
                }),
            pl: board.columns.length === 1 ? 0 : 4,
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
  );
});
