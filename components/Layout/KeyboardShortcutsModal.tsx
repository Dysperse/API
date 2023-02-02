import { Box, Dialog, Icon, IconButton, Typography } from "@mui/material";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useStatusBar } from "../../hooks/useStatusBar";

export default function KeyboardShortcutsModal() {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open);
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
          maxWidth: "calc(100vw - 32px)",
        },
      }}
    >
      <Box className="flex items-center">
        <Typography variant="h5">Keyboard shortcuts</Typography>
        <IconButton
          sx={{ ml: "auto" }}
          onClick={() => setOpen(false)}
        >
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
                name: "Toggle group list",
                keys: ["ctrl", "p"],
              },
              {
                name: "View active group",
                keys: ["ctrl", "shift", "p"],
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
                name: "Boards",
                keys: ["ctrl", "1"],
              },
              {
                name: "Inventory",
                keys: ["ctrl", "2"],
              },
              {
                name: "Coach",
                keys: ["ctrl", "3"],
              },
              {
                name: "Spaces",
                keys: ["ctrl", "4"],
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
            ],
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
              <Typography className="flex" sx={{ mt: 1 }} key={shortcut.name}>
                <Box>{shortcut.name}</Box>{" "}
                <Box className="ml-auto">
                  {shortcut.keys.map((key) => (
                    <span className="kbd" key={shortcut.name}>
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
