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
      <Typography variant="overline" sx={{ mt: -5 }}>
        Note
      </Typography>
      <TaskDescription
        disabled={shouldDisable}
        description={data.description}
        handleChange={(e) => task.edit(task.id, "description", e)}
      />
      <Typography variant="overline">Attachments</Typography>
      <Box sx={{ ...styles.section, background: "transparent" }}>
        {/* Description */}
        <TextField
          className="item"
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
            sx: { p: 1 },
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
          <Box className="item" sx={{ px: 1 }}>
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
        <ListItem
          className="item"
          sx={{ px: "10px!important", background: "transparent!important" }}
        >
          <ListItemText
            primary={
              data.image ? (
                isImage && <ImageViewer size="medium" url={data.image} />
              ) : (
                <span style={{ opacity: 0.5, fontWeight: 400 }}>Files</span>
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
      </Box>
    </>
  );
});
