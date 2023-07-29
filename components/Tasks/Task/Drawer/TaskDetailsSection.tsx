import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
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
import toast from "react-hot-toast";
import { parseEmojis } from ".";
import { ImageViewer } from "../ImageViewer";
import {
  isAddress,
  isValidHttpUrl,
  videoChatPlatforms,
} from "./locationHelpers";

export const TaskDetailsSection = React.memo(function TaskDetailsSection({
  handleEdit,
  data,
  styles,
  shouldDisable,
}: any) {
  const storage = useAccountStorage();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <Box sx={styles.section}>
      <TextField
        className="item"
        onBlur={(e) => handleEdit(data.id, "where", e.target.value)}
        onKeyDown={(e: any) =>
          e.key === "Enter" && !e.shiftKey && e.target.blur()
        }
        placeholder={"Location or URL"}
        disabled={shouldDisable}
        fullWidth
        defaultValue={parseEmojis(data.where || "")}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            py: 1,
            px: 3,
          },
          ...((isValidHttpUrl(data.where) || isAddress(data.where)) && {
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    if (isAddress(data.where)) {
                      window.open(
                        `https://maps.google.com/?q=${encodeURIComponent(
                          data.where,
                        )}`,
                      );
                      return;
                    }
                    window.open(data.where);
                  }}
                >
                  <Icon>
                    {videoChatPlatforms.find((platform) =>
                      data.where.includes(platform),
                    )
                      ? "call"
                      : isAddress(data.where)
                      ? "location_on"
                      : "link"}
                  </Icon>
                  {videoChatPlatforms.find((platform) =>
                    data.where.includes(platform),
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
        onBlur={(e) => handleEdit(data.id, "description", e.target.value)}
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
          sx={{
            ml: "auto",
            display: "flex",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          {data.image && <ImageViewer url={data.image} small />}
          <IconButton
            sx={{ background: palette[3] }}
            disabled={shouldDisable}
            onClick={() => toast("Coming soon!", toastStyles)}
          >
            <Icon>{data.image ? "close" : "add"}</Icon>
          </IconButton>
        </Box>
      </ListItem>
    </Box>
  );
});
