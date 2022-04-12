import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddPopup from "./AddPopup";

import dynamic from "next/dynamic";
const AddIcon = dynamic(() => import("@mui/icons-material/Add"));

export function FloatingActionButton() {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: {
          lg: "15px",
          sm: "70px",
          md: "15px",
          xs: "70px"
        },
        right: "15px"
      }}
    >
      <AddPopup>
        <Fab variant="extended" color="primary" aria-label="add">
          <AddIcon sx={{ mr: 2 }} />
          Create
        </Fab>
      </AddPopup>
    </Box>
  );
}
