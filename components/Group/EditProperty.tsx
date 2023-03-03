import React, { cloneElement, useEffect } from "react";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { updateSettings } from "../Settings/updateSettings";
import { Color } from "./Color";

import {
  Alert,
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
import { useSession } from "../../pages/_app";

/**
 * Edit property
 */
export function EditProperty({
  children,
  propertyId,
  accessToken,
  color,
}: any) {
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

  const trigger = cloneElement(children, {
    onClick: () => setOpen(!open),
  });
  const session = useSession();
  return (
    <>
      {trigger}
      <SwipeableDrawer
        ModalProps={{
          keepMounted: false,
        }}
        disableSwipeToOpen
        anchor="right"
        open={open}
        swipeAreaWidth={0}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: {
            background: session.user.darkMode ? "hsl(240,11%,25%)" : "#fff",
            px: 3,
            width: { xs: "100vw", sm: "50vw" },
            py: 2,
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
              height: "var(--navbar-height)",
              px: 2,
              background: session.user.darkMode ? "hsl(240,11%,25%)" : "#fff",
              borderBottom: "1px solid",
              borderColor: session.user.darkMode ? "hsl(240,11%,20%)" : "#eee",
              color: session.user.darkMode ? "#fff" : "#000",
              boxShadow: "none",
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
                onClick={() => setOpen(false)}
              >
                <Icon>close</Icon>
              </IconButton>
              <Typography sx={{ fontWeight: "900", mx: "auto" }}>
                Edit group
              </Typography>
              <IconButton edge="start" color="inherit" sx={{ opacity: 0 }}>
                <Icon>close</Icon>
              </IconButton>
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
            <Alert severity="warning">
              Heads up! Changing your group type may cause data loss. Change
              this setting with caution.
            </Alert>
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
          <Alert severity="info" sx={{ mt: 2 }}>
            Due to caching, changes will take up to 24 hours to appear for
            everyone in your group.
          </Alert>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
