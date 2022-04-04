import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";

import { Navbar } from "./Navbar";

export default function ItemPopup(props) {
  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    document.querySelector("meta[name='theme-color']")<HTMLElement>.content = open
      ? "#eee"
      : "#1565c0";
      if(open) {
        document.body.classList.add("prevent-scroll");
      }
      else {
        document.body.classList.remove("prevent-scroll");
      }
    setState(open);
  };

  const list = (data) => (
    <Box
      sx={{
        width: {
          lg: "45vw",
          sm: "100vw",
          xs: "100vw",
          md: "90vw"
        },
        height: "100vh",
        display: "flex",
        alignItems: "center"
      }}
      role="presentation"
    >
      <Navbar itemData={data} toggleDrawer={toggleDrawer} />
      <Box
        sx={{
          px: "50px",
          width: "100%"
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
          {data.title}
        </Typography>
        <Typography sx={{ mt: 2, mb: 3 }} variant="h4">
          {data.amount}
        </Typography>
        <div>
          {data.categories.split(",").map((category) => {
            if (category.trim() !== "") {
              return <Chip label={category} sx={{ m: "5px" }} />;
            }
          })}
        </div>
        <TextField
          id="outlined-basic"
          fullWidth
          multiline
          sx={{ mt: 3, width: "100%" }}
          size="small"
          placeholder="Click to add note"
          defaultValue={data.note}
          variant="outlined"
        />
      </Box>
    </Box>
  );

  return (
    <React.Fragment key="right">
      <div onClick={toggleDrawer(true)}>{props.children}</div>
      <SwipeableDrawer
        anchor="right"
        onOpen={false}
        open={state}
        onClose={toggleDrawer(false)}
      >
        {list(props.data)}
      </SwipeableDrawer>
    </React.Fragment>
  );
}
