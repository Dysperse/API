import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
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
          <Column mutationUrl={url} boardId={board.id} column={column} />
        ))}
    </>
  );
}

export const Board = React.memo(function ({ board }: any) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
    align: "start",
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
            display: "flex",
            gap: "10px",
            overflowX: "scroll",
            pl: 4,
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
              {data.length < 5 && (
                <CreateColumn id={board.id} mutationUrl={url} />
              )}
              <IconButton
                sx={{
                  transition: "none!important",
                  backgroundColor: "rgba(200, 200, 200, 0.3)!important",
                  border: "1px solid rgba(200, 200, 200, 0.5)!important",
                  "&:hover,&:active": {
                    color: "#000",
                    border: "1px solid rgba(200, 200, 200, 0.9)!important",
                    backgroundColor: "rgba(200, 200, 200, 0.5)!important",
                  },
                }}
              >
                <span className="material-symbols-outlined">more_vert</span>
              </IconButton>
            </Box>
          ) : (
            <Box>Loading...</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
});
