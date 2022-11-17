import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { Column } from "./Column";
import { ErrorHandler } from "../error";
import { useApi } from "../../hooks/useApi";

export function Board({ board }: any) {
  const { data, error } = useApi("property/boards/tasks", {
    id: board.id,
  });
  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your tasks" />
      )}
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        {data && data.map((column) => <Column column={column} />)}
        {data && data.length < 5 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
              <span className="material-symbols-outlined">add</span>
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
