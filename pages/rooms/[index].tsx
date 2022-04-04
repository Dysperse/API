import * as React from "react";

import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import { Suggestions } from "./Suggestions";

import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import { Items } from "./Items";

function Room() {
  return (
    <Box
      sx={{
        p: 2,
        width: {
          xs: "100vw",
          md: "100%"
        }
      }}
    >
      <Header />
      <Suggestions />
      <Toolbar />
      <Box
        sx={{
          mr: {
            sm: -2
          }
        }}
      >
        <Masonry columns={{ xs: 1, sm: 3 }} spacing={{ xs: 0, sm: 2 }}>
          <Items />
        </Masonry>
      </Box>
    </Box>
  );
}
export default Room;
