import { updateSettings } from "./updateSettings";

import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Radio,
  RadioGroup,
} from "@mui/material";
import { colors } from "../../lib/colors";
import { useSession } from "../../pages/_app";

/**
 * Function to change theme color (Not dark mode!)
 */
function ThemeColorSettings() {
  const session = useSession();
  return (
    <Box>
      <ListSubheader>Theme color</ListSubheader>
      {[
        "lime",
        "red",
        "green",
        "blue",
        "pink",
        "purple",
        "indigo",
        "amber",
        "cyan",
      ].map((color) => (
        <RadioGroup
          name="controlled-radio-buttons-group"
          key={color}
          onClick={() => updateSettings("color", color.toLowerCase())}
        >
          <ListItem
            secondaryAction={
              <Radio
                edge="end"
                checked={session?.themeColor === color.toLowerCase()}
              />
            }
            disablePadding
            sx={{ textTransform: "capitalize" }}
          >
            <ListItemIcon
              sx={{
                mr: 0,
                pr: 0,
                width: "20px",
              }}
            >
              <Box
                sx={{
                  ml: "20px",
                  background: colors[color]["A700"],
                  width: "20px",
                  height: "20px",
                  borderRadius: 999,
                }}
              />
            </ListItemIcon>
            <ListItemButton sx={{ borderRadius: 2, transition: "none" }}>
              <ListItemText primary={color === "lime" ? "Dysperse" : color} />
            </ListItemButton>
          </ListItem>
        </RadioGroup>
      ))}
    </Box>
  );
}

/**
 * Top-level component for the appearance settings page.
 */
export default function AppearanceSettings() {
  const session = useSession();

  return (
    <Box>
      <ThemeColorSettings />
      <ListSubheader sx={{ mt: 3 }}>Theme</ListSubheader>
      <RadioGroup name="controlled-radio-buttons-group">
        <ListItem
          key="light"
          onClick={() => updateSettings("darkMode", "false")}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings("darkMode", "false")}
              checked={!session.user.darkMode}
            />
          }
          disablePadding
        >
          <ListItemIcon
            sx={{
              mr: 0,
              pr: 0,
              width: "20px",
            }}
          >
            <Box
              sx={{
                ml: "20px",
                background: "#aaa",
                width: "20px",
                height: "20px",
                borderRadius: 999,
              }}
            />
          </ListItemIcon>
          <ListItemButton sx={{ borderRadius: 2, transition: "none" }}>
            <ListItemText primary="Light" />
          </ListItemButton>
        </ListItem>
        <ListItem
          key="dark"
          onClick={() => updateSettings("darkMode", "true")}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings("darkMode", "true")}
              checked={session.user.darkMode}
            />
          }
          disablePadding
        >
          <ListItemIcon
            sx={{
              mr: 0,
              pr: 0,
              width: "20px",
            }}
          >
            <Box
              sx={{
                ml: "20px",
                background: "hsl(240,11%,10%)",
                width: "20px",
                height: "20px",
                borderRadius: 999,
              }}
            />
          </ListItemIcon>
          <ListItemButton sx={{ borderRadius: 2, transition: "none" }}>
            <ListItemText primary="Dark" />
          </ListItemButton>
        </ListItem>
      </RadioGroup>
    </Box>
  );
}
