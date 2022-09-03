import Box from "@mui/material/Box";
import React from "react";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
export function ErrorHandler({ error }: { error: string }): JSX.Element {
  return (
    <Box
      sx={{
        p: 2,
        background: "rgba(200,200,200,.5)",
        borderRadius: 5,
        display: "flex",
        color: red["900"],
        background: red["50"],
        gap: 2,
        alignItems: "center",
      }}
    >
      <span className="material-symbols-rounded">error</span>
      {error}
      <IconButton
        color="inherit"
        onClick={() => window.location.reload()}
        sx={{
          borderRadius: 5,
          ml: "auto",
          mr: 1,
          "@keyframes a": {
            "0%": {
              transform: "rotate(0deg)",
            },
            "100%": {
              transform: "rotate(360deg)",
            },
          },
          "&:hover": {
            animation: "a .5s forwards",
          },
        }}
      >
        <span className="material-symbols-outlined">refresh</span>
      </IconButton>
    </Box>
  );
}
