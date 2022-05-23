import Box from "@mui/material/Box";
import React from "react";

export function Puller() {
  return (
    <Box
      className="puller"
      sx={{
        width: "50px",
        backgroundColor: global.theme === "dark" ? "#505050" : "#eee",
        height: "7px",
        margin: "auto",
        borderRadius: 9,
        mt: 1,
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        display: "inline-block"
      }}
    />
  );
}
