import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";

import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import {
  AppBar,
  Box,
  CircularProgress,
  Icon,
  IconButton,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import dynamic from "next/dynamic";
import { cloneElement, useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../../ConfirmationModal";
import { cards } from "./cards";

const ImageRecognition = dynamic(() => import("./scan"));

export function CreateItemModal({
  mutationUrl,
  room,
  children,
}: {
  mutationUrl: string;
  room: any;
  children: JSX.Element;
}) {
  const ref: any = useRef();
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("[]");

  const handleOpen = useCallback(() => {
    setOpen(true);
    setTimeout(() => ref.current?.focus(), 200);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTitle("");
    setQuantity("");
    setCategory("[]");
    mutate(mutationUrl);
  }, [mutationUrl]);

  const trigger = cloneElement(children, { onClick: handleOpen });

  const [emblaRef] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin() as any]
  );

  const handleSubmit = useCallback(() => {
    if (title.trim() === "") {
      toast.error("Please enter a title", toastStyles);
      return;
    }
    setLoading(true);
    fetchRawApi("property/inventory/items/create", {
      room: room[0],
      name: title,
      quantity: quantity,
      category,
      lastModified: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    })
      .then(() => {
        toast("Created item!", toastStyles);
        setLoading(false);
        setOpen(false);
        mutate(mutationUrl);
        setTitle("");
        setQuantity("");
        setCategory("[]");
      })
      .catch(() => {
        toast.error("Couldn't create item. Please try again.", toastStyles);
        setLoading(false);
      });
  }, [category, mutationUrl, quantity, title, room]);

  const storage = useAccountStorage();
  const isDark = useDarkMode(session.darkMode);

  const handleClick = (item) => {
    setTitle(item.name);
    setQuantity("1");
    setCategory(JSON.stringify(item.tags));
  };
  const palette = useColor(session.themeColor, isDark);

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "100vw",
            borderRadius: { xs: "0!important", sm: "20px 20px 0 0" },
            height: "100vh",
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
            color: isDark ? "#fff" : "#000",
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

            <Typography sx={{ mx: "auto", fontWeight: 600 }}>
              {capitalizeFirstLetter(room || "")}
            </Typography>
            <IconButton
              onClick={handleSubmit}
              disabled={storage?.isReached === true}
            >
              {loading ? <CircularProgress size={24} /> : <Icon>check</Icon>}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <TextField
            inputRef={ref}
            disabled={loading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter") handleSubmit();
            }}
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
                  onClick={() => handleClick(item)}
                  component="div"
                  sx={{
                    userSelect: "none",
                    mt: 4,
                    display: "inline-block",
                    width: "175px",
                    flex: "0 0 175px",
                    overflow: "hidden",
                    height: "150px",
                    background: palette[2],
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
                      background: palette[3],
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
      </SwipeableDrawer>
    </>
  );
}
