import { CircularProgress, Icon, IconButton, Tooltip } from "@mui/material";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "../../../../../../lib/client/useSession";

export function ImageModal({ image, setImage, styles }) {
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const session = useSession();

  const handleUpload = useCallback(
    async (e: any) => {
      const key = "9fb5ded732b6b50da7aca563dbe66dec";
      const form = new FormData();
      form.append("image", e.target.files[0]);
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
      <Tooltip title="Attach an image (alt • s)" placement="top">
        <IconButton
          size="small"
          onClick={() => {
            navigator.vibrate(50);
            document.getElementById("imageAttachment")?.click();
          }}
          sx={{
            ...styles,
            mx: 0.5,
            ...(image && {
              background: `hsl(240,11%,${session.user.darkMode ? 20 : 80}%)`,
            }),
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
