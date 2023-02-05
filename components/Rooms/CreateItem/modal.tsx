import {
  AppBar,
  Drawer,
  Icon,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { cloneElement, useCallback, useState } from "react";
import ImageRecognition from "./scan";

export function CreateItemModal({
  room,
  children,
}: {
  room: any;
  children: JSX.Element;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");

  const trigger = cloneElement(children, {
    onClick: handleOpen,
  });

  return (
    <>
      {trigger}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "100vw",
            height: "100vh",
            background: global.user.darkMode ? "hsl(240,11%,15%)" : "#fff",
          },
        }}
        anchor="bottom"
      >
        <AppBar
          elevation={0}
          sx={{
            zIndex: 99,
            background: "rgba(255,255,255,.3)",
            color: "#000",
            borderBottom: "1px solid",
            borderColor: "rgba(200,200,200,.3)",
          }}
          position="sticky"
        >
          <Toolbar>
            <IconButton onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
            <Typography
              sx={{ mx: "auto", textTransform: "capitalize", fontWeight: 600 }}
            >
              {room}
            </Typography>
            <IconButton>
              <Icon>check</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            InputProps={{
              className: "font-heading",
              sx: {
                borderRadius: 3,
                px: 1.5,
                fontSize: "40px",
              },
            }}
            placeholder="Item title"
            fullWidth
          />
          <TextField
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 3,
                px: 1.5,
                mt: 2,
                fontSize: "20px",
              },
            }}
            placeholder="Add a quantity"
            fullWidth
          />
        </Box>
        <ImageRecognition
          room={room}
          setTitle={setTitle}
          setQuantity={setQuantity}
        />
      </Drawer>
    </>
  );
}
