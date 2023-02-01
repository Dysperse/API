import React, { useEffect } from "react";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { updateSettings } from "../Settings/updateSettings";
import { Color } from "./Color";

import {
  AppBar,
  Box,
  Button,
  Chip,
  FormControl,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

/**
 * Edit property
 */
export function EditProperty({ color }: { color: string }) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  /**
   * Handles click event
   * @param event Event
   */
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );
  /**
   * Set property type
   */
  const handleCloseMenu = React.useCallback((type) => {
    updateSettings("type", type, false, null, true);
    setAnchorEl(null);
  }, []);

  /**
   * Callback for updating note blur event
   * @param { React.FocusEvent<HTMLInputElement> } event
   */
  const handleUpdateName = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      if (target.value !== global.property.profile.name) {
        updateSettings("name", target.value, false, null, true);
      }
    },
    []
  );

  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      {global.property.permission !== "read-only" && (
        <IconButton
          disableRipple
          sx={{
            color: "inherit",
            zIndex: 1,
          }}
          onClick={() => setOpen(!open)}
        >
          <Icon>more_vert</Icon>
        </IconButton>
      )}
      <SwipeableDrawer
        ModalProps={{
          keepMounted: false,
        }}
        disableSwipeToOpen
        anchor="bottom"
        open={open}
        swipeAreaWidth={0}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: {
            background: colors[color][global.user.darkMode ? 900 : 50],
            color: colors[color][global.user.darkMode ? 50 : 900],
            px: 3,
            width: { xs: "auto", sm: "50vw" },
            py: 2,
            maxHeight: "calc(100vh - 20px)",
            mx: "auto",
          },
        }}
      >
        <Box
          sx={{
            height: { xs: "100vh", sm: "auto" },
            px: 2,
            pt: 10,
          }}
        >
          <AppBar
            position="absolute"
            sx={{
              p: 2,
              py: 1,
              background: colors[color][global.user.darkMode ? 900 : 50],
              color: colors[color][global.user.darkMode ? 50 : 900],
              boxShadow: "none",
            }}
          >
            <Toolbar>
              <IconButton
                disableRipple
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
                onClick={() => setOpen(false)}
              >
                <Icon>expand_more</Icon>
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Edit group
              </Typography>
            </Toolbar>
          </AppBar>

          <TextField
            variant="filled"
            sx={{ color: "white" }}
            defaultValue={global.property.profile.name || "Untitled property"}
            id="nameInput"
            label="Home name / Family name / Address"
            onKeyDown={(e: any) => {
              if (e.key == "Enter") e.target.blur();
            }}
            placeholder="1234 Rainbow Road"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              handleUpdateName(e)
            }
          />

          <Button
            variant="outlined"
            sx={{
              mt: 2,
            }}
            disabled={global.property.permission === "read-only"}
            onClick={handleClick}
            onMouseDown={handleClick}
          >
            <Typography
              sx={{
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Icon className="outlined">
                {global.property.profile.type === "dorm"
                  ? "cottage"
                  : global.property.profile.type === "apartment"
                  ? "location_city"
                  : global.property.profile.type === "study group"
                  ? "school"
                  : "home"}
              </Icon>
              {global.property.profile.type}
            </Typography>
          </Button>
          <FormControl fullWidth sx={{ my: 4 }}>
            <Typography
              sx={{
                background: colors[color][global.user.darkMode ? 800 : 100],
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "error",
              }}
            >
              <Icon>warning</Icon>
              Heads up! Changing your group type may cause data loss. Change
              this setting with caution.
            </Typography>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => {
                setAnchorEl(null);
              }}
            >
              <MenuItem onClick={() => handleCloseMenu("house")} value="house">
                House
              </MenuItem>
              <MenuItem
                onClick={() => handleCloseMenu("apartment")}
                value="house"
              >
                Apartment
              </MenuItem>
              <MenuItem onClick={() => handleCloseMenu("dorm")} value="house">
                Dorm
              </MenuItem>
              <MenuItem
                onClick={() => handleCloseMenu("study group")}
                value="house"
              >
                Study group{" "}
                <Chip
                  color="error"
                  size="small"
                  label="NEW"
                  sx={{ pointerEvents: "none" }}
                />
              </MenuItem>
            </Menu>
          </FormControl>

          {[
            "lime",
            "pink",
            "orange",
            "red",
            "brown",
            "green",
            "teal",
            "cyan",
            "blue",
            "purple",
            "indigo",
            "deepPurple",
          ].map((item) => (
            <Color s={color} color={item} key={color} />
          ))}
        </Box>
      </SwipeableDrawer>
    </>
  );
}
