import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { House } from "../HouseProfile/House";
import { Puller } from "../Puller";
import { updateSettings } from "../Settings/updateSettings";
import { useHotkeys } from "react-hotkeys-hook";

/**
 * Color component for house profile
 * @param {any} {s
 * @param {any} color
 * @param {any} setColor}
 * @returns {any}
 */
export function Color({
  s,
  color,
  setColor,
}: {
  s: string;
  color: string;
  setColor: (color: string) => void;
}) {
  return (
    <CardActionArea
      onClick={() => {
        setColor(color);
        updateSettings("color", color, false, null, true);
      }}
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "inline-flex",
        mr: 1,
        mb: 1,
        backgroundColor: colors[color]["A700"],
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          color: "#fff",
          margin: "auto",
          opacity: s === color ? 1 : 0,
        }}
      >
        check
      </span>
    </CardActionArea>
  );
}

/**
 * Invite button to trigger property list
 * @returns {any}
 */
export function InviteButton() {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open);

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  useHotkeys(
    "ctrl+p",
    (e) => {
      e.preventDefault();
      setOpen(!open);
    },
    [open]
  );

  /**
   * Description
   * @param {React.MouseEvent<any>} event
   * @returns {any}
   */
  const handleClick = (event) => {
    const target = event.currentTarget as HTMLButtonElement;
    setAnchorEl(target);
  };

  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  const trigger = useMediaQuery("(min-width: 600px)");

  let properties = global.user.properties;
  properties = properties.filter(
    (v, i, a) => a.findIndex((t) => t.propertyId === v.propertyId) === i
  );

  return (
    <>
      <SwipeableDrawer
        ModalProps={{
          keepMounted: true,
        }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor={trigger ? "left" : "bottom"}
        BackdropProps={{
          sx: {
            background: {
              sm: "rgba(0,0,0,0)!important",
            },
            backdropFilter: { sm: "blur(0px)" },
            opacity: { sm: "0!important" },
          },
        }}
        sx={{
          display: { sm: "flex" },
          alignItems: { sm: "start" },
          mt: 9,
          ml: 2,
          justifyContent: { sm: "start" },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            boxShadow: "none!important",
            position: { sm: "static!important" },
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            height: "auto",
            maxWidth: { sm: "350px" },
            overflow: "hidden!important",
            borderRadius: {
              xs: "20px 20px 0 0",
              sm: 5,
            },
            ...(global.user.darkMode && {
              background: "hsl(240, 11%, 20%)",
            }),
          },
        }}
        swipeAreaWidth={0}
      >
        <Box sx={{ display: { sm: "none" } }}>
          <Puller />
        </Box>
        <Box sx={{ px: 2, textAlign: "center" }} />
        {properties.map((house: any) => (
          <House
            handleClose={() => setOpen(false)}
            key={house.accessToken.toString()}
            data={house}
          />
        ))}
      </SwipeableDrawer>
      <Box id="new_trigger" onClick={handleClick} />
      <Button
        disableFocusRipple
        id="houseProfileTrigger"
        onClick={() => setOpen(true)}
        sx={{
          background: "transparent!important",
          "&:active": {
            transform: "scale(0.95)",
          },
          "&:hover": {
            backgroundColor:
              global.theme === "dark"
                ? "hsl(240,11%,15%)!important"
                : "#eee!important",
          },
          userSelect: "none",
          cursor: "pointer",
          transition: "transform .2s",
          p: 1,
          py: 0,
          gap: 1,
          color: "inherit",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "500",
            maxWidth: "40vw",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          // className="font-secondary"
          noWrap
        >
          {global.property.profile.name || "My group"}
        </Typography>
        <span className="material-symbols-outlined">expand_more</span>
      </Button>{" "}
    </>
  );
}
