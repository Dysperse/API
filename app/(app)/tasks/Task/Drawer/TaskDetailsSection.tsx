import { FileDropInput } from "@/components/FileDrop";
import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
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
  const { session } = useSession();

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
      toast("Coming soon!");
    }
  };

  return (
    <Box sx={styles.section}>
      {/* Description */}
      <TextField
        className="item"
        onBlur={(e) => task.edit(task.id, "description", e.target.value)}
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
      <TextField
        className="item"
        onBlur={(e) => task.edit(data.id, "where", e.target.value)}
        onKeyDown={(e: any) =>
          e.key === "Enter" && !e.shiftKey && e.target.blur()
        }
        placeholder={"Location or URL"}
        disabled={shouldDisable}
        fullWidth
        defaultValue={data.where}
        key={data.where}
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
                  sx={{
                    background: {
                      xs: palette[4] + "!important",
                      sm: palette[3] + "!important",
                    },
                  }}
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

      {/* Notifications */}
      {data.notifications.length > 0 && !task.dateOnly && (
        <Box className="item">
          <Typography sx={{ p: 3, pt: 2, opacity: 0.6, pb: 0 }}>
            Notifications
          </Typography>
          <Box
            sx={{
              gap: 1.5,
              p: 3,
              pb: 2,
              pt: 1,
              display: "flex",
              overflow: "scroll",
            }}
          >
            {data.notifications.map((notif) => (
              <Chip key={notif} label={`${notif} minutes before`} />
            ))}
          </Box>
        </Box>
      )}
      <ListItem className="item">
        <ListItemText
          primary={
            data.image ? (
              isImage && <ImageViewer size="medium" url={data.image} />
            ) : (
              <span style={{ opacity: 0.5, fontWeight: 400 }}>Attachments</span>
            )
          }
        />
        <Box
          sx={{ ml: "auto", display: "flex", gap: 1.5, alignItems: "center" }}
        >
          {isImage ? (
            <IconButton
              sx={{ background: palette[3] }}
              disabled={shouldDisable}
              onClick={handleAttachmentButtonClick}
            >
              <Icon>close</Icon>
            </IconButton>
          ) : (
            !shouldDisable && (
              <FileDropInput
                onError={() => toast.error("Couldn't upload")}
                onSuccess={async (res) => {
                  await fetchRawApi(
                    session,
                    "property/boards/column/task/edit",
                    {
                      image: res.data.url,
                      id: task.id,
                    }
                  );
                  await task.mutate();
                }}
                onUploadStart={() => {}}
              >
                <IconButton
                  sx={{ background: palette[3] }}
                  onClick={handleAttachmentButtonClick}
                >
                  <Icon>add</Icon>
                </IconButton>
              </FileDropInput>
            )
          )}
        </Box>
      </ListItem>
    </Box>
  );
});
