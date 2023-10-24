"use client";

import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
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
import { ThemeColorSettings } from "./ThemeColorSettings";

/**
 * Top-level component for the appearance settings page.
 */
export default function AppearanceSettings() {
  const { session, setSession } = useSession();

  return (
    <>
      <ThemeColorSettings />
      <ListSubheader sx={{ mt: 3 }}>Theme</ListSubheader>
      <RadioGroup name="controlled-radio-buttons-group">
        <ListItem
          onClick={() =>
            updateSettings(["darkMode", "dark"], { session, setSession })
          }
          secondaryAction={
            <Radio
              edge="end"
              onChange={() =>
                updateSettings(["darkMode", "dark"], { session, setSession })
              }
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
                background: "hsl(240,11%,20%)",
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
          onClick={() =>
            updateSettings(["darkMode", "light"], { session, setSession })
          }
          secondaryAction={
            <Radio
              edge="end"
              onChange={() =>
                updateSettings(["darkMode", "light"], { session, setSession })
              }
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
            <ListItemText primary="Light" />
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() =>
            updateSettings(["darkMode", "system"], { session, setSession })
          }
          secondaryAction={
            <Radio
              edge="end"
              onChange={() =>
                updateSettings(["darkMode", "system"], { session, setSession })
              }
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
    </>
  );
}
