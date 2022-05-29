import { useState } from "react";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export function CreatePlanner() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SwipeableDrawer
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        swipeAreaWidth={0}
        anchor="bottom"
        sx={{
          display: "flex",
          alignItems: { xs: "end", sm: "center" },
          height: "100vh",
          justifyContent: "center",
        }}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
            borderBottomRightRadius: { xs: 0, sm: "28px!important" },
            position: "unset",
            mx: "auto",
            maxWidth: { sm: "70vw", xs: "100vw" },
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ py: 6, px: 7 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "600" }}>
            Create
          </Typography>
          <TextField />
        </Box>
      </SwipeableDrawer>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ float: "right", borderRadius: 5, boxShadow: 0 }}
        size="large"
      >
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "10px" }}
        >
          add
        </span>
        Create
      </Button>
    </>
  );
}
