import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { SortMenu } from "./SortMenu";

export function Toolbar() {
  return (
    <Box sx={{ textAlign: "right", mb: 2 }}>
      <TextField
        label="Search"
        id="outlined-size-small"
        size="small"
        sx={{ verticalAlign: "middle" }}
      />
      <SortMenu />
    </Box>
  );
}
