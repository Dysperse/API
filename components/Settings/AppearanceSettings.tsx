import { updateSettings } from "./updateSettings";

import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Radio,
  RadioGroup,
} from "@mui/material";

/**
 * Function to change theme color (Not dark mode!)
 */
function ThemeColorSettings() {
  return (
    <Box>
      <ListSubheader>Theme color</ListSubheader>
      {[
        "Brown",
        "Red",
        "Lime",
        "Green",
        "Blue",
        "Pink",
        "Purple",
        "Indigo",
        "Yellow",
        "Amber",
        "Orange",
        "Teal",
        "Cyan",
        "Grey",
      ].map((color) => (
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          key={color}
        >
          <ListItem
            secondaryAction={
              <Radio
                edge="end"
                checked={themeColor === color.toLowerCase()}
                onChange={() => {
                  updateSettings("color", color.toLowerCase());
                  setThemeColor(color.toLowerCase());
                }}
              />
            }
            disablePadding
          >
            <ListItemButton
              sx={{ borderRadius: 2, transition: "none" }}
              onClick={() => {
                updateSettings("color", color.toLowerCase());
                setThemeColor(color.toLowerCase());
              }}
            >
              <ListItemText primary={color === "Brown" ? "Carbon" : color} />
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
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
      >
        <ListItem
          key="light"
          onClick={() => {
            global.setTheme("light");
            updateSettings("darkMode", "false");
          }}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => {
                global.setTheme("light");
                updateSettings("darkMode", "false");
              }}
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
          onClick={() => {
            global.setTheme("dark");
            updateSettings("darkMode", "true");
          }}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => {
                global.setTheme("dark");
                updateSettings("darkMode", "true");
              }}
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
