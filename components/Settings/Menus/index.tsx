import {
  Avatar,
  Box,
  Icon,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useBackButton } from "../../../lib/client/useBackButton";
import { useSession } from "../../../lib/client/useSession";
import { colors } from "../../../lib/colors";
import { Puller } from "../../Puller";

/**
 * Top-level component for the settings page.
 * @param content content
 * @param icon Icon
 * @param primary Settings option heading
 * @param secondary Secondary text for the settings option
 */
export function SettingsMenu({
  parentOpen,
  content,
  icon,
  primary,
  secondary,
  disabled = false,
}: {
  parentOpen: boolean;
  content: React.ReactNode;
  icon: React.ReactNode;
  primary: string | React.ReactNode;
  secondary: string | React.ReactNode;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);

  useBackButton(() => setOpen(false));

  const session = useSession();

  return (
    <>
      <ListItemButton
        disableRipple
        disabled={disabled}
        onClick={() => setOpen(true)}
        sx={{
          transiton: { sm: "none!important" },
          "& *": { transiton: { sm: "none!important" } },
          "&:hover": {
            background: session.user.darkMode
              ? "hsl(240,11%,25%)"
              : colors[session?.themeColor || "grey"][50],
            "& .MuiAvatar-root": {
              background: session.user.darkMode
                ? "hsl(240,11%,35%)"
                : colors[session?.themeColor || "grey"][100],
            },
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              color: session.user.darkMode ? "#fff" : "#000",
              borderRadius: 4,
              background: session.user.darkMode
                ? "hsl(240,11%,30%)"
                : colors[session?.themeColor || "grey"][100],
            }}
          >
            <Icon className="outlined">{icon}</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography sx={{ fontWeight: "600" }}>{primary}</Typography>
          }
          secondary={secondary}
        />
      </ListItemButton>
      {parentOpen && (
        <SwipeableDrawer
          open={open}
          anchor="bottom"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(false)}
          PaperProps={{
            sx: {
              width: {
                sm: "50vw",
              },
              maxWidth: "650px",
              overflow: "scroll",
              maxHeight: "93vh",

              mx: "auto",
              ...(session.user.darkMode && {
                background: "hsl(240, 11%, 25%)",
              }),
            },
          }}
          sx={{
            zIndex: 9999,
          }}
          disableSwipeToOpen
        >
          <Box sx={{ maxHeight: "95vh", overflow: "scroll" }}>
            <Puller />
            <Box sx={{ px: 5 }}>
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: "900",
                  mt: 5,
                  mb: 3,
                }}
                variant="h5"
                component="div"
              >
                {primary}
              </Typography>
              {content}
            </Box>
          </Box>
        </SwipeableDrawer>
      )}
    </>
  );
}
