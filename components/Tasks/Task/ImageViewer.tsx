import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useBackButton } from "@/lib/client/useBackButton";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Avatar, Backdrop, Box, Chip, Icon, IconButton } from "@mui/material";
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
      <Backdrop
        open={open}
        sx={{ position:"fixed", top:0,left:0,zIndex: 9999999999 }}
        onContextMenu={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            zIndex: 999,
            bottom: 10,
            borderRadius: 99,
            p: 0.5,
            background: addHslAlpha(palette[3], 0.5),
            backdropFilter: "blur(10px)",
            left: "50%",
            transform: "translateX(-50%)",
            transition: "all .2s",
            ...(zoom && {
              transform: "translateX(-50%) scale(.9)",
              opacity: 0,
            }),
          }}
        >
          <IconButton
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <Icon>close</Icon>
          </IconButton>
          <IconButton onClick={() => downloadImage(url)}>
            <Icon>download</Icon>
          </IconButton>
          <IconButton onClick={() => shareImage(url)}>
            <Icon>ios_share</Icon>
          </IconButton>
          <IconButton onClick={() => window.open(url)}>
            <Icon>open_in_new</Icon>
          </IconButton>
        </Box>
        <img
          onClick={(e) => {
            setZoom(!zoom);
          }}
          src={url}
          alt="Modal"
          width="100%"
          height="100%"
          style={{
            transition: "all .2s",
            objectFit: "contain",
            transform: zoom ? "scale(.98)" : "scale(.9)",
          }}
        />
      </Backdrop>
      <Chip
        label={"Attachment"}
        avatar={<Avatar src={url} />}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
      />
    </>
  );
}
