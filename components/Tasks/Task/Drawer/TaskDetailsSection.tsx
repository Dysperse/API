import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React from "react";
import { createPortal } from "react-dom";
import { FileDrop } from "react-file-drop";
import toast from "react-hot-toast";
import { parseEmojis } from ".";
import { ImageViewer } from "../ImageViewer";
import { useTaskContext } from "./Context";
import {
  isAddress,
  isValidHttpUrl,
  videoChatPlatforms,
} from "./locationHelpers";
export const TaskDetailsSection = React.memo(function TaskDetailsSection({
  data,
  styles,
  shouldDisable,
}: any) {
  const storage = useAccountStorage();
  const task = useTaskContext();
  const session = useSession();

  const parsedWhere = parseEmojis(data.where || "");
  const isHttpOrAddress = isValidHttpUrl(data.where) || isAddress(data.where);
  const isImage = !!data.image;
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const handleLocationButtonClick = () => {
    if (isAddress(data.where)) {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(data.where)}`
      );
      return;
    }
    window.open(data.where);
  };

  const handleAttachmentButtonClick = async () => {
    if (isImage) {
      await fetchRawApi(session, "property/boards/column/task/edit", {
        image: "null",
        id: task.id,
      });
      await task.mutate();
    } else {
      // Add attachment functionality here (currently using a placeholder toast)
      toast("Coming soon!", toastStyles);
    }
  };

  return (
    <Box sx={styles.section}>
      {createPortal(
        <FileDrop
          onFrameDragEnter={(event) => console.log("onFrameDragEnter", event)}
          onFrameDragLeave={(event) => console.log("onFrameDragLeave", event)}
          onFrameDrop={async (e: any) => {
            const key = "9fb5ded732b6b50da7aca563dbe66dec";
            const form = new FormData();
            form.append("image", e["dataTransfer"].files[0]);
            try {
              const res = await fetch(
                `https://api.imgbb.com/1/upload?name=image&key=${key}`,
                { method: "POST", body: form }
              ).then((res) => res.json());

              await fetchRawApi(session, "property/boards/column/task/edit", {
                image: res.data.url,
                id: task.id,
              });
              await task.mutate();
            } catch (e) {
              toast.error(
                "Yikes! An error occured while trying to upload your image. Please try again later"
              );
            }
          }}
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
      <TextField
        className="item"
        onBlur={(e) => task.edit(data.id, "where", e.target.value)}
        onKeyDown={(e: any) =>
          e.key === "Enter" && !e.shiftKey && e.target.blur()
        }
        placeholder={"Location or URL"}
        disabled={shouldDisable}
        fullWidth
        defaultValue={parsedWhere}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { py: 1, px: 3 },
          ...(isHttpOrAddress && {
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleLocationButtonClick}
                >
                  <Icon>
                    {videoChatPlatforms.find((platform) =>
                      data.where.includes(platform)
                    )
                      ? "call"
                      : isAddress(data.where)
                      ? "location_on"
                      : "link"}
                  </Icon>
                  {videoChatPlatforms.find((platform) =>
                    data.where.includes(platform)
                  )
                    ? "Call"
                    : isAddress(data.where)
                    ? "Maps"
                    : "Open"}
                </Button>
              </InputAdornment>
            ),
          }),
        }}
      />

      {/* Description */}
      <TextField
        className="item"
        onBlur={(e) => task.edit(data.id, "description", e.target.value)}
        onKeyDown={(e: any) =>
          e.key === "Enter" && !e.shiftKey && e.target.blur()
        }
        multiline
        placeholder={
          storage?.isReached === true
            ? "You've reached your account storage limits and you can't add a description."
            : "Note"
        }
        disabled={shouldDisable}
        fullWidth
        defaultValue={parseEmojis(data.description || "")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: { py: 1.5, px: 3 },
        }}
      />
      <ListItem className="item">
        <ListItemText primary="Attachments" />
        <Box
          sx={{ ml: "auto", display: "flex", gap: 1.5, alignItems: "center" }}
        >
          {isImage && <ImageViewer url={data.image} small />}
          <IconButton
            sx={{ background: palette[3] }}
            disabled={shouldDisable}
            onClick={handleAttachmentButtonClick}
          >
            <Icon>{isImage ? "close" : "add"}</Icon>
          </IconButton>
        </Box>
      </ListItem>
    </Box>
  );
});
