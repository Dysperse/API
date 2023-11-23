import { FileDropInput } from "@/components/FileDrop";
import { useSession } from "@/lib/client/session";
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
import { ImageViewer } from "../ImageViewer";
import { useTaskContext } from "./Context";
import { TaskDescription } from "./TaskDescription";
import {
  isAddress,
  isValidHttpUrl,
  videoChatPlatforms,
} from "./locationHelpers";

export const TaskDetailsSection = React.memo(function TaskDetailsSection({
  data,
  shouldDisable,
  styles,
}: any) {
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
      await fetchRawApi(session, "space/tasks/task", {
        method: "PUT",
        params: {
          image: "null",
          id: task.id,
        },
      });
      await task.mutate();
    } else {
      // Add attachment functionality here (currently using a placeholder toast)
      toast("Coming soon!");
    }
  };

  return (
    <>
      <Box sx={{ mr: -1, ml: 1 }}>
        <Typography variant="overline" sx={{ mt: -5 }}>
          Note
        </Typography>
        {/* Normalizes negative margin */}
        <TaskDescription
          disabled={shouldDisable}
          description={data.description}
          handleChange={(e) => task.edit(task.id, "description", e)}
        />
        <Typography
          sx={{
            ...(!data.where &&
              !data.image && {
                display: "none",
              }),
          }}
          variant="overline"
        >
          Attachments
        </Typography>
        {/* Description */}
        {data.where && (
          <TextField
            onBlur={(e) => task.edit(data.id, "where", e.target.value)}
            onKeyDown={(e: any) =>
              e.key === "Enter" && !e.shiftKey && e.target.blur()
            }
            disabled={shouldDisable}
            fullWidth
            placeholder="Add link / location"
            defaultValue={data.where}
            key={data.where}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                p: 1,
                px: 1,
                borderRadius: 3,
                mx: -1,
                transition: "background .4s",
                border: "2px solid transparent",
                ...styles.item,
              },
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
        )}
        {/* Notifications */}
        {data.notifications.length > 0 && !task.dateOnly && (
          <Box className="item" sx={{ px: 1, mx: -1 }}>
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
        {data.image && isImage && (
          <ListItem
            className="item"
            sx={{
              px: 1,
              mx: -1,
              py: "0px!important",
              ...styles.item,
            }}
          >
            <ListItemText
              primary={
                <ImageViewer label="Image" size="medium" url={data.image} />
              }
            />
            <Box
              sx={{
                ml: "auto",
                display: "flex",
                gap: 1.5,
                alignItems: "center",
              }}
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
                      await fetchRawApi(session, "space/tasks/task", {
                        method: "PUT",
                        params: {
                          image: res.data.url,
                          id: task.id,
                        },
                      });
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
        )}
      </Box>
    </>
  );
});
