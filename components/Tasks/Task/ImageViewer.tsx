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
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export function ImageViewer({
  size = "small",
  url,
}: {
  size: "small" | "medium";
  url: string;
}) {
  const { session } = useSession();
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

  useHotkeys(
    "space",
    () => {
      if (open) setZoom((z) => !z);
    },
    [open, setZoom]
  );

  useHotkeys(
    "shift+d",
    () => {
      if (open) downloadImage(url);
    },
    [open, url]
  );

  useHotkeys(
    "shift+s",
    () => {
      if (open) shareImage(url);
    },
    [open, url]
  );

  useHotkeys(
    "shift+o",
    () => {
      if (open) window.open(url);
    },
    [open, url]
  );

  useBackButton(() => setOpen(false));

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        PaperProps={{
          sx: {
            background: "transparent",
            width: "100dvw",
            height: "100dvh",
            maxWidth: "100dvw",
            borderRadius: 0,
            "& img": {
              cursor: zoom ? "zoom-out" : "zoom-in",
            },
          },
        }}
        onContextMenu={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onClose={() => {
          setOpen(false);
          setZoom(false);
        }}
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
          <Tooltip title="Download (shift + d)">
            <IconButton onClick={() => downloadImage(url)} size="large">
              <Icon>download</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Share (shift + s)">
            <IconButton onClick={() => shareImage(url)} size="large">
              <Icon>ios_share</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Open (shift + o)">
            <IconButton onClick={() => window.open(url)} size="large">
              <Icon>open_in_new</Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <img
          onClick={() => {
            setZoom(!zoom);
          }}
          src={url}
          alt="Modal"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            margin: "auto",
            transition: "all .4s cubic-bezier(.17,.67,.32,1.58), opacity 0s",
            objectFit: "contain",
            transform: zoom ? "scale(1)" : "scale(.9)",
            borderRadius: zoom ? "0px" : "28px",
          }}
        />
      </SwipeableDrawer>
      <Chip
        size={size}
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
