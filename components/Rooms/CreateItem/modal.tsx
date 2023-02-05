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
import dayjs from "dayjs";
import { cloneElement, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../hooks/useApi";
import { useStatusBar } from "../../../hooks/useStatusBar";
import { toastStyles } from "../../../lib/useCustomTheme";
import ImageRecognition from "./scan";

export function CreateItemModal({
  room,
  children,
}: {
  room: any;
  children: JSX.Element;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleSubmit = useCallback(() => {
    fetchApiWithoutHook("property/inventory/create", {
      room: room.toString().toLowerCase(),
      name: title,
      quantity: quantity,
      lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    })
      .then(() => {
        toast("Created item!", toastStyles);
        setLoading(false);
        setOpen(false);
        mutate(
          `/api/property/inventory/list/?${new URLSearchParams({
            sessionId: global.user.token,
            property: global.property.propertyId,
            accessToken: global.property.accessToken,
            userIdentifier: global.user.identifier,
            room: room.toString().toLowerCase(),
          }).toString()}`
        );
      })
      .catch(() => {
        toast.error("Couldn't create item. Please try again.", toastStyles);
        setLoading(false);
      });
  }, []);

  useStatusBar(open);
  
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
            <IconButton onClick={handleSubmit}>
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
