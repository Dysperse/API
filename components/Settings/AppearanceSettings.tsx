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

/**
 * Function to change theme color (Not dark mode!)
 */
function ThemeColorSettings() {
  return (
    <Box>
      <ListSubheader>Theme color</ListSubheader>
      {[
        "brown",
        "red",
        "lime",
        "green",
        "blue",
        "pink",
        "purple",
        "indigo",
        "amber",
        "orange",
        "teal",
        "cyan",
      ].map((color) => (
        <RadioGroup
          name="controlled-radio-buttons-group"
          key={color}
          onClick={() => updateSettings("color", color.toLowerCase())}
        >
          <ListItem
            secondaryAction={
              <Radio edge="end" checked={themeColor === color.toLowerCase()} />
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
              <ListItemText primary={color === "brown" ? "Dysperse" : color} />
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
  return (
    <Box>
      <ThemeColorSettings />
      <ListSubheader sx={{ mt: 3 }}>Theme</ListSubheader>
      <RadioGroup
        name="controlled-radio-buttons-group"
      >
        <ListItem
          key="light"
          onClick={() => updateSettings("darkMode", "false")}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings("darkMode", "false")}
              checked={global.theme === "light"}
            />
          }
          disablePadding
        >
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
              checked={global.user.darkMode}
            />
          }
          disablePadding
        >
          <ListItemButton sx={{ borderRadius: 2, transition: "none" }}>
            <ListItemText primary="Dark" />
          </ListItemButton>
        </ListItem>
      </RadioGroup>
    </Box>
  );
}
