import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { updateSettings } from "./updateSettings";

/**
 * Function to change theme color (Not dark mode!)
 */
function ThemeColorSettings() {
  return (
    <Box sx={{ my: 4 }}>
      <ListSubheader>Theme color</ListSubheader>
      {[
        "Brown",
        "Red",
        "Green",
        "Blue",
        "Pink",
        "Purple",
        "Orange",
        "Teal",
        "Cyan",
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
    <>
      <Box
        sx={{
          py: 1,
          px: {
            sm: 10,
          },
        }}
      >
        <ThemeColorSettings />
        <ListSubheader>Theme</ListSubheader>
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
                checked={global.theme === "dark"}
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
    </>
  );
}
