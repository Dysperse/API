import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useBackButton } from "@/lib/client/useBackButton";
import { useColor, useDarkMode } from "@/lib/client/useColor";

import { useSession } from "@/lib/client/useSession";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, {
  cloneElement,
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { updateSettings } from "../../lib/client/updateSettings";
import { Color } from "./Color";

/**
 * Edit property
 */
export function EditProperty({
  propertyData,
  mutatePropertyData,
  children,
  color,
}: any) {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState(
    propertyData.profile.name || "Untitled property"
  );

  const [vanishingTasks, setVanishingTasks] = useState<boolean>(
    propertyData.profile.vanishingTasks
  );

  useEffect(() => {
    setVanishingTasks(propertyData.profile.vanishingTasks);
  }, [propertyData.profile.vanishingTasks]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const deferredName = useDeferredValue(name);

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
  const handleCloseMenu = useCallback(
    (type) => {
      updateSettings("type", type, false, null, true).then(() =>
        setTimeout(mutatePropertyData, 1000)
      );
      setAnchorEl(null);
    },
    [mutatePropertyData]
  );
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);

  /**
   * Callback for updating note blur event
   * @param { React.FocusEvent<HTMLInputElement> } event
   */
  const handleUpdateName = useCallback(() => {
    if (deferredName !== propertyData.profile.name) {
      updateSettings("name", deferredName, false, null, true).then(() =>
        setTimeout(mutatePropertyData, 1000)
      );
    }
  }, [propertyData.profile.name, mutatePropertyData, deferredName]);

  useBackButton(() => setOpen(false));

  const trigger = cloneElement(children, {
    onClick: () => setOpen(!open),
  });
  const palette = useColor(color, isDark);

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            background: palette[1],
            width: { xs: "100vw", sm: "50vw" },
            height: { xs: "100vh", sm: "auto" },
          },
        }}
      >
        <AppBar
          sx={{
            background: palette[1],
            borderColor: palette[2],
          }}
        >
          <Toolbar>
            <IconButton color="inherit" onClick={() => setOpen(false)}>
              <Icon>close</Icon>
            </IconButton>
            <Typography sx={{ fontWeight: "900", mx: "auto" }}>Edit</Typography>
            <IconButton color="inherit" sx={{ opacity: 0 }}>
              <Icon>close</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            px: 3,
            pt: 3,
          }}
        >
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Group name"
            fullWidth
            onKeyDown={(e: any) => {
              e.key === "Enter" && e.target.blur();
            }}
            placeholder="1234 Rainbow Road"
          />
          <IconButton
            onClick={handleUpdateName}
            sx={{
              ...(!propertyData.profile.name == deferredName && {
                background: palette[2],
              }),
            }}
            disabled={propertyData.profile.name == deferredName}
          >
            <Icon>check</Icon>
          </IconButton>
        </Box>

        <Box
          sx={{
            overflow: "scroll",
            whiteSpace: "nowrap",
            pl: 3,
          }}
        >
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
          ].map((item, index) => (
            <Color
              s={color}
              color={item}
              key={index}
              mutatePropertyData={mutatePropertyData}
            />
          ))}
        </Box>
        <Box sx={{ p: 3 }}>
          <Divider />
          <Button
            variant="outlined"
            sx={{
              my: 2,
              px: 2,
            }}
            disabled={propertyData.permission === "read-only"}
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
                {propertyData.profile.type === "dorm"
                  ? "cottage"
                  : propertyData.profile.type === "apartment"
                  ? "location_city"
                  : propertyData.profile.type === "study group"
                  ? "school"
                  : "home"}
              </Icon>
              {propertyData.profile.type}
            </Typography>
          </Button>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Heads up! Changing your group type may cause data loss. Change this
            setting with caution.
          </Alert>
          <ListItemButton disableRipple>
            <ListItemText
              primary="Vanishing tasks"
              secondary="Delete completed tasks more than 14 days old"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={vanishingTasks}
                onChange={(_, newValue) => {
                  setVanishingTasks(newValue);

                  updateSettings(
                    "vanishingTasks",
                    newValue ? "true" : "false",
                    false,
                    null,
                    true
                  ).then(() => setTimeout(mutatePropertyData, 1000));
                }}
              />
            </ListItemSecondaryAction>
          </ListItemButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {["house", "apartment", "dorm", "study group"].map((type) => (
              <MenuItem
                onClick={() => handleCloseMenu(type)}
                value={type}
                disabled={type == propertyData.profile.type}
                key={type}
              >
                {capitalizeFirstLetter(type)}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
