import { updateSettings } from "@/lib/client/updateSettings";
import { useSession } from "@/lib/client/useSession";
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
import * as colors from "@radix-ui/colors";
import Layout from ".";
import { useDarkMode } from "../../lib/client/useColor";

/**
 * Function to change theme color (Not dark mode!)
 */
function ThemeColorSettings() {
  const session = useSession();
  return (
    <Box>
      <ListSubheader>Theme color</ListSubheader>
      {Object.keys(colors)
        .filter((color) => !color.includes("Dark"))
        .filter((color) => !color.endsWith("A"))
        .map((color) => (
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
                    background: colors[color] && colors[color][color + 9],
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
  const isDark = useDarkMode(session.darkMode);

  return (
    <Layout>
      <ThemeColorSettings />
      <ListSubheader sx={{ mt: 3 }}>Theme</ListSubheader>
      <RadioGroup name="controlled-radio-buttons-group">
        <ListItem
          onClick={() => updateSettings("darkMode", "dark")}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings("darkMode", "dark")}
              checked={session.darkMode === "dark"}
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
            <ListItemText primary="Light" />
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() => updateSettings("darkMode", "light")}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings("darkMode", "light")}
              checked={session.darkMode === "light"}
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
                background: "hsl(240,11%,90%)",
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
        <ListItem
          onClick={() => updateSettings("darkMode", "system")}
          secondaryAction={
            <Radio
              edge="end"
              onChange={() => updateSettings("darkMode", "system")}
              checked={session.darkMode === "system"}
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
            <ListItemText primary="System" />
          </ListItemButton>
        </ListItem>
      </RadioGroup>
    </Layout>
  );
}
