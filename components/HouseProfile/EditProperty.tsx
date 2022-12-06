import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { updateSettings } from "../Settings/updateSettings";
import { Color } from "../Layout/InviteButton";

/**
 * Edit property
 */
export function EditProperty({
  open,
  setOpen,
  color,
  setColor,
  propertyType,
  setPropertyType,
}: {
  color: string;
  setOpen: (open: boolean) => void;
  propertyType: string;
  setColor: (color: string) => void;
  setPropertyType: (propertyType: string) => void;
  open: boolean;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  /**
   * Handles click event
   * @param event Event
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  /**
   * Set property type
   */
  const handleCloseMenu = (type) => {
    updateSettings("type", type, false, null, true);
    setPropertyType(type);
    setAnchorEl(null);
  };

  /**
   * Callback for updating note blur event
   * @param { React.FocusEvent<HTMLInputElement> } event
   */
  const handleUpdateName = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.value !== global.property.profile.name) {
      updateSettings("name", target.value, false, null, true);
    }
  };

  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  useEffect(() => {
    if (open) {
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", colors[color][900]);
    }
  }, [open]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      swipeAreaWidth={0}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      PaperProps={{
        elevation: 0,
        sx: {
          background: colors[color]["50"].toString(),
          color: colors[color]["900"].toString(),
          px: 3,
          width: { xs: "100%", sm: "50vw" },
          py: 2,
          maxHeight: "calc(100vh - 20px)",
          borderRadius: "20px 20px 0 0",
          mx: "auto",
        },
      }}
    >
      <Box
        sx={{
          height: { xs: "100vh", sm: "auto" },
          px: 2,
          borderRadius: "20px 20px 0 0",

          pt: 10,
        }}
      >
        <AppBar
          position="absolute"
          sx={{
            p: 2,
            borderRadius: "20px 20px 0 0",

            py: 1,
            background: colors[color]["50"].toString(),
            color: colors[color]["900"].toString(),
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <IconButton
              disableRipple
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              aria-label="menu"
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-rounded">expand_more</span>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Edit property
            </Typography>
          </Toolbar>
        </AppBar>
        <TextField
          fullWidth
          variant="filled"
          sx={{ color: "white" }}
          defaultValue={global.property.profile.name || "Untitled property"}
          id="nameInput"
          label="Home name / Family name / Address"
          placeholder="1234 Rainbow Road"
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            handleUpdateName(e)
          }
        />

        <Button
          variant="outlined"
          sx={{
            border: "0!important",
            background: "rgba(0,0,0,0.1)",
            mt: 3,
            borderBottom: "1px solid #313131 !important",
            py: 2,
            px: 1.5,
            width: "100%",
            textAlign: "left",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            borderRadius: 0,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
          aria-haspopup="true"
          disabled={global.property.permission === "read-only"}
          onClick={handleClick}
        >
          <Typography
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              color: "black",
              gap: "10px",
            }}
          >
            <span className="material-symbols-rounded">
              {propertyType === "dorm"
                ? "cottage"
                : propertyType === "apartment"
                ? "location_city"
                : "home"}
            </span>
            {propertyType}
          </Typography>
        </Button>
        <FormControl fullWidth sx={{ mb: 4 }}>
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
          </Menu>
        </FormControl>

        <Color setColor={setColor} s={color} color={"pink"} />
        <Color setColor={setColor} s={color} color={"red"} />
        <Color setColor={setColor} s={color} color={"green"} />
        <Color setColor={setColor} s={color} color={"teal"} />
        <Color setColor={setColor} s={color} color={"cyan"} />
        <Color setColor={setColor} s={color} color={"blue"} />
        <Color setColor={setColor} s={color} color={"indigo"} />
        <Color setColor={setColor} s={color} color={"purple"} />
        <Color setColor={setColor} s={color} color={"deepPurple"} />
        <Color setColor={setColor} s={color} color={"orange"} />
        <Color setColor={setColor} s={color} color={"deepOrange"} />
        <Color setColor={setColor} s={color} color={"lime"} />
        <Color setColor={setColor} s={color} color={"indigo"} />
        <Color setColor={setColor} s={color} color={"brown"} />
      </Box>
    </SwipeableDrawer>
  );
}
