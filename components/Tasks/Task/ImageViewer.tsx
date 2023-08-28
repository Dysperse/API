import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useBackButton } from "@/lib/client/useBackButton";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Box,
  Chip,
  Icon,
  IconButton,
  SwipeableDrawer,
} from "@mui/material";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export function ImageViewer({ url }: { url: string }) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const [zoom, setZoom] = useState(false);

  const [open, setOpen] = useState<boolean>(false);

  async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc);
    const blob = await image.blob();
    const imageURL = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = Date.now().toString();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function shareImage(imageSrc) {
    const blob = await fetch(imageSrc).then((r) => r.blob());
    const data = {
      files: [
        new File([blob], Date.now().toString() + ".png", {
          type: blob.type,
        }),
      ],
    };
    try {
      if (!navigator.canShare(data)) {
        throw new Error("Can't share data.");
      }
      await navigator.share(data);
    } catch (err: any) {
      console.error(err.name, err.message);
    }
  }

  useHotkeys(
    "esc",
    (e) => {
      if (open) {
        e.stopPropagation();
        setOpen(false);
      }
    },
    [open]
  );
  useBackButton(() => setOpen(false));

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        PaperProps={{
          sx: {
            width: "100dvw",
            height: "100dvh",
            maxWidth: "100dvh",
            borderRadius: 0,
            "& img": {
              "&:active": {
                opacity: 0.8,
              },
              cursor: zoom ? "zoom-out" : "zoom-in",
            },
          },
        }}
        onContextMenu={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            zIndex: 999,
            bottom: 14,
            borderRadius: 99,
            p: 0.5,
            background: addHslAlpha(palette[2], 0.9),
            backdropFilter: "blur(10px)",
            left: "50%",
            transform: "translateX(-50%)",
            transition: "all .4s cubic-bezier(.17,.67,.32,1.58)",
            ...(zoom && {
              transform: "translateX(-50%) scale(.9)",
              opacity: 0,
            }),
          }}
        >
          <IconButton
            size="large"
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <Icon>close</Icon>
          </IconButton>
          <IconButton onClick={() => downloadImage(url)} size="large">
            <Icon>download</Icon>
          </IconButton>
          <IconButton onClick={() => shareImage(url)} size="large">
            <Icon>ios_share</Icon>
          </IconButton>
          <IconButton onClick={() => window.open(url)} size="large">
            <Icon>open_in_new</Icon>
          </IconButton>
        </Box>
        <img
          onClick={(e) => {
            setZoom(!zoom);
          }}
          src={url}
          alt="Modal"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            margin: "auto",
            transition: "all .4s cubic-bezier(.17,.67,.32,1.58)",
            objectFit: "contain",
            transform: zoom ? "scale(1)" : "scale(.9)",
            borderRadius: zoom ? "0px" : "28px",
          }}
        />
      </SwipeableDrawer>
      <Chip
        label={"Attachment"}
        avatar={<Avatar src={url} alt="🖼" />}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
      />
    </>
  );
}
