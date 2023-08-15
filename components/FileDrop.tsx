import { useSession } from "@/lib/client/session";
import { Box, Icon } from "@mui/material";
import {
  MutableRefObject,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { FileDrop } from "react-file-drop";
import { toast } from "react-hot-toast";

export function FileDropInput({ children, onUploadStart, onSuccess, onError }) {
  const session = useSession();
  const inputRef: MutableRefObject<HTMLInputElement | undefined> = useRef();

  const handleUpload = useCallback(
    async (e: any, drop: boolean = false, image: null | boolean = null) => {
      const form = new FormData();
      const key = "9fb5ded732b6b50da7aca563dbe66dec";

      if (image) {
        form.append("image", e);
      } else {
        form.append("image", e[drop ? "dataTransfer" : "target"].files[0]);
      }

      try {
        onUploadStart();
        const res = await fetch(
          `https://api.imgbb.com/1/upload?name=image&key=${key}`,
          { method: "POST", body: form }
        ).then((res) => res.json());
        onSuccess(res);
      } catch (e: any) {
        onError(e.message);
        toast.error(
          "Yikes! An error occured while trying to upload your image. Please try again later"
        );
      }
    },
    [onError, onUploadStart, onSuccess]
  );

  useEffect(() => {
    const handlePaste = (event) => {
      const items = (event.clipboardData || (window as any).clipboardData)
        .items;

      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          if (!blob) return;
          handleUpload(blob, true, true);
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handleUpload]);

  const trigger = cloneElement(children, {
    onClick: () => inputRef.current?.click(),
  });

  return (
    <>
      <input
        type="file"
        ref={inputRef as any}
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
      {trigger}
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
    </>
  );
}
