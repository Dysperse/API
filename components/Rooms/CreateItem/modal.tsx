import {
  AppBar,
  CircularProgress,
  Drawer,
  Icon,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import dynamic from "next/dynamic";
import { cloneElement, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../hooks/useApi";
import { useStatusBar } from "../../../hooks/useStatusBar";
import { colors } from "../../../lib/colors";
import { toastStyles } from "../../../lib/useCustomTheme";
import { ConfirmationModal } from "../../ConfirmationModal";
import { cards } from "./cards";

const ImageRecognition = dynamic(() => import("./scan"));

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
  const handleClose = useCallback(() => {
    setOpen(false);
    setTitle("");
    setQuantity("");
    setCategory("[]");
  }, []);

  useStatusBar(open);

  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("[]");

  const trigger = cloneElement(children, {
    onClick: handleOpen,
  });

  const [emblaRef] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin()]
  );

  const handleSubmit = useCallback(() => {
    if (title.trim() == "") {
      toast.error("Please enter a title", toastStyles);
      return;
    }
    setLoading(true);
    fetchApiWithoutHook("property/inventory/items/create", {
      room: room.toString().toLowerCase(),
      name: title,
      quantity: quantity,
      category: category,
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
        setTitle("");
        setQuantity("");
        setCategory("[]");
      })
      .catch(() => {
        toast.error("Couldn't create item. Please try again.", toastStyles);
        setLoading(false);
      });
  }, [category, quantity, room, title]);

  return (
    <>
      {trigger}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "100vw",
            borderRadius: { xs: "0!important", sm: "20px 20px 0 0" },
            height: "100vh",
            background: global.user.darkMode ? "hsl(240,11%,15%)" : "#fff",
          },
        }}
        anchor="bottom"
      >
        <AppBar
          elevation={0}
          sx={{
            borderTopLeftRadius: { xs: 0, sm: "20px" },
            borderTopRightRadius: { xs: 0, sm: "20px" },
            zIndex: 99,
            background: global.user.darkMode
              ? "hsla(240,11%,20%,0.1)"
              : "rgba(255,255,255,.3)",
            color: global.user.darkMode ? "#fff" : "#000",
            borderBottom: "1px solid",
            borderColor: global.user.darkMode
              ? "hsla(240,11%,20%,0.8)"
              : "rgba(200,200,200,.3)",
          }}
          position="sticky"
        >
          <Toolbar>
            <ConfirmationModal
              callback={handleClose}
              disabled={title.trim() === ""}
              title="Discard changes?"
              question="Changes you made will not be saved"
            >
              <IconButton disabled={loading}>
                <Icon>close</Icon>
              </IconButton>
            </ConfirmationModal>

            <Typography
              sx={{ mx: "auto", textTransform: "capitalize", fontWeight: 600 }}
            >
              {room}
            </Typography>
            <IconButton onClick={handleSubmit}>
              {loading ? <CircularProgress size={24} /> : <Icon>check</Icon>}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <TextField
            disabled={loading}
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
            disabled={loading}
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
          <Box
            className="embla"
            ref={emblaRef}
            sx={{
              width: "100%",
              whiteSpace: "nowrap",
              overflowX: "scroll",
              overflowY: "visible",
            }}
          >
            <div className="embla__container">
              {cards.map((item) => (
                <Box
                  key={item.name.toString()}
                  onClick={() => {
                    setTitle(item.name);
                    setQuantity("1");
                    setCategory(JSON.stringify(item.tags));
                  }}
                  component="div"
                  sx={{
                    userSelect: "none",
                    mt: 4,
                    display: "inline-block",
                    width: "175px",
                    flex: "0 0 175px",
                    overflow: "hidden",
                    height: "150px",
                    background: global.user.darkMode
                      ? "hsl(240, 11%, 20%)"
                      : colors[themeColor][50],
                    transition: "transform .2s",
                    "&:active": {
                      transform: "scale(.95)",
                      transition: "none",
                    },
                    cursor: "pointer",
                    mr: 2,
                    borderRadius: 6,
                  }}
                >
                  <Box
                    sx={{
                      height: "80px",
                      background: global.user.darkMode
                        ? "hsl(240, 11%, 25%)"
                        : colors[themeColor][100],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{ fontSize: "30px" }}
                      className="material-symbols-rounded"
                    >
                      {item.icon}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      height: "70px",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2">Add</Typography>
                      <Typography>{item.name}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </div>
          </Box>
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
