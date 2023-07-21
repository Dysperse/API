import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FileDrop } from "react-file-drop";
import toast from "react-hot-toast";

export function ImageModal({ image, setImage, styles }) {
  const session = useSession();
  const fileInputRef: any = useRef(null);

  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const handleUpload = useCallback(
    async (e: any, drop: boolean = false) => {
      const key = "9fb5ded732b6b50da7aca563dbe66dec";

      const form = new FormData();
      form.append("image", e[drop ? "dataTransfer" : "target"].files[0]);

      setImageUploading(true);

      try {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?name=image&key=${key}`,
          { method: "POST", body: form }
        ).then((res) => res.json());

        setImage(JSON.stringify(res.data));

        setImageUploading(false);
      } catch (e) {
        toast.error(
          "Yikes! An error occured while trying to upload your image. Please try again later"
        );
        setImageUploading(false);
      }
    },
    [setImage]
  );

  return (
    <>
      {createPortal(
        <FileDrop
          onFrameDragEnter={(event) => console.log("onFrameDragEnter", event)}
          onFrameDragLeave={(event) => console.log("onFrameDragLeave", event)}
          onFrameDrop={(event) => handleUpload(event, true)}
          onDragOver={(event) => console.log("onDragOver", event)}
          onDragLeave={(event) => console.log("onDragLeave", event)}
          onDrop={(files, event) => console.log("onDrop!", files, event)}
        >
          <Box
            sx={{
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              p: 1,
              px: 2,
              borderRadius: 99,
              gap: 2,
            }}
          >
            <Icon>upload</Icon>
            Drop to upload an image
          </Box>
        </FileDrop>,
        document.body
      )}
      <Tooltip title="Attach image (alt • s)" placement="top">
        <IconButton
          size="small"
          onClick={() => {
            vibrate(50);
            fileInputRef?.current?.click();
          }}
          sx={{
            ...styles(palette, Boolean(image)),
            mx: 0.5,
          }}
        >
          {imageUploading ? (
            <CircularProgress size={20} sx={{ mx: 0.5 }} />
          ) : (
            <Icon {...(!image && { className: "outlined" })}>image</Icon>
          )}
        </IconButton>
      </Tooltip>
      <input
        type="file"
        ref={fileInputRef}
        id="imageAttachment"
        name="imageAttachment"
        aria-label="attach an image"
        style={{
          opacity: 0,
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
        onChange={handleUpload}
        accept="image/png, image/jpeg"
      />
    </>
  );
}
