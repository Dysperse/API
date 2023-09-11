import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Dialog, Icon, IconButton, Typography } from "@mui/material";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function KeyboardShortcutsModal() {
  const session = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );
  const [open, setOpen] = React.useState<boolean>(false);

  useHotkeys(
    "ctrl+/",
    (e) => {
      e.preventDefault();
      setOpen(!open);
    },
    [open]
  );

  return (
    <Dialog
      scroll="body"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          borderRadius: 5,
          minWidth: "500px",
          p: 3,
          userSelect: "none",
          maxWidth: "calc(100vw - 32px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5">Keyboard shortcuts</Typography>
        <IconButton sx={{ ml: "auto" }} onClick={() => setOpen(false)}>
          <Icon>close</Icon>
        </IconButton>
      </Box>
      <Box sx={{ mt: 2 }}>
        {[
          {
            name: "General",
            shortcuts: [
              {
                name: "Show this dialog",
                keys: ["ctrl", "/"],
              },
              {
                name: "Open search",
                keys: ["ctrl", "k"],
              },
              {
                name: "Go to group",
                keys: ["ctrl", "g"],
              },
              {
                name: "Go to my profile",
                keys: ["ctrl", "p"],
              },
              {
                name: "Go to my friends",
                keys: ["ctrl", "u"],
              },
              {
                name: "Toggle app drawer",
                keys: ["ctrl", "q"],
              },
            ],
          },
          {
            name: "Navigation",
            shortcuts: [
              {
                name: "Home",
                keys: ["ctrl", "shift", "1"],
              },
              {
                name: "Boards",
                keys: ["ctrl", "shift", "2"],
              },
              {
                name: "Inventory",
                keys: ["ctrl", "shift", "4"],
              },
              {
                name: "Profile",
                keys: ["ctrl", "p"],
              },
              {
                name: "Settings",
                keys: ["ctrl", ","],
              },
            ],
          },
          {
            name: "Inventory",
            shortcuts: [
              {
                name: "Navigate 1 room upwards",
                keys: ["ctrl", <>&#8593;</>],
              },
              {
                name: "Navigate 1 room downwards",
                keys: ["ctrl", <>&#8595;</>],
              },
              { name: "Sort", keys: ["s"] },
            ],
          },
          {
            name: "Task creation",
            shortcuts: [
              { name: "Open dialog", keys: ["/"] },
              { name: "Toggle priority", keys: ["alt", "a"] },
              { name: "Attach image", keys: ["alt", "w"] },
              { name: "Insert emoji", keys: ["alt", "e"] },
              { name: "Add location", keys: ["alt", "l"] },
              { name: "Add note", keys: ["alt", "d"] },
              { name: "Set date", keys: ["alt", "s"] },
            ],
          },
          {
            name: "Image viewer",
            shortcuts: [
              { name: "Toggle zoom", keys: ["space"] },
              { name: "Download", keys: ["shift", "d"] },
              { name: "Share", keys: ["shift", "s"] },
              { name: "Open", keys: ["shift", "o"] },
            ],
          },
          {
            name: "Task management",
            shortcuts: [{ name: "Toggle priority", keys: ["!"] }],
          },
          {
            name: "Item management",
            shortcuts: [
              {
                name: "Delete an item",
                keys: ["alt", "d"],
              },
              {
                name: "Edit an item",
                keys: ["alt", "e"],
              },
              {
                name: "Star an item",
                keys: ["alt", "s"],
              },
              {
                name: "Move to another room",
                keys: ["alt", "m"],
              },
              {
                name: "Focus on note input",
                keys: ["alt", "n"],
              },
            ],
          },
        ].map((group, index) => (
          <React.Fragment key={group.name}>
            <Typography sx={{ mt: index === 0 ? 0 : 2, fontWeight: "700" }}>
              {group.name}
            </Typography>
            {group.shortcuts.map((shortcut) => (
              <Typography sx={{ display: "flex", mt: 1 }} key={shortcut.name}>
                <Box>{shortcut.name}</Box>{" "}
                <Box sx={{ ml: "auto" }}>
                  {shortcut.keys.map((key) => (
                    <span
                      className="kbd"
                      key={shortcut.name}
                      style={{
                        background: palette[3],
                      }}
                    >
                      {key}
                    </span>
                  ))}
                </Box>
              </Typography>
            ))}
          </React.Fragment>
        ))}
      </Box>
    </Dialog>
  );
}
