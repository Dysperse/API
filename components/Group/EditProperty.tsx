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
import React, { cloneElement, useCallback } from "react";
import { useBackButton } from "../../lib/client/useBackButton";
import { useSession } from "../../pages/_app";
import { updateSettings } from "../Settings/updateSettings";
import { Color } from "./Color";

/**
 * Edit property
 */
export function EditProperty({ children, color }: any) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  /**
   * Handles click event
   * @param event Event
   */
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );
  /**
   * Set property type
   */
  const handleCloseMenu = useCallback((type) => {
    updateSettings("type", type, false, null, true);
    setAnchorEl(null);
  }, []);
  const session = useSession();

  /**
   * Callback for updating note blur event
   * @param { React.FocusEvent<HTMLInputElement> } event
   */
  const handleUpdateName = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      if (target.value !== session.property.profile.name) {
        updateSettings("name", target.value, false, null, true);
      }
    },
    [session.property.profile.name]
  );

  useBackButton(() => setOpen(false));

  const trigger = cloneElement(children, {
    onClick: () => setOpen(!open),
  });
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
          <AppBar>
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
            defaultValue={session.property.profile.name || "Untitled property"}
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
            disabled={session.property.permission === "read-only"}
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
                {session.property.profile.type === "dorm"
                  ? "cottage"
                  : session.property.profile.type === "apartment"
                  ? "location_city"
                  : session.property.profile.type === "study group"
                  ? "school"
                  : "home"}
              </Icon>
              {session.property.profile.type}
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
