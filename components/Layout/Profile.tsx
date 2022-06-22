import { Global } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
import * as colors from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import Settings from "../Settings/index";

const drawerBleeding = 0;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
}));

function Accounts({ setOpen }: any) {
  return (
    <List sx={{ width: "100%", bgcolor: "transparent" }}>
      <Avatar
        alt="Profile picture"
        src={global.session.user.image}
        sx={{ mx: "auto", width: "100px", height: "100px" }}
      />
      <ListItem
        secondaryAction={
          <div onClick={() => setOpen(false)}>
            <Settings />
          </div>
        }
      >
        <ListItemText
          sx={{
            pt: 2,
          }}
          primary={
            <Typography
              variant="h5"
              sx={{ fontWeight: "800", textAlign: "center" }}
            >
              {global.session && global.session.user.name}
            </Typography>
          }
          secondary={
            <Typography
              sx={{ fontWeight: "600", textAlign: "center", mt: 1 }}
              variant="body2"
              color="text.primary"
            >
              {global.session && global.session.user.email}
            </Typography>
          }
        />
      </ListItem>
    </List>
  );
}

export function ProfileMenu(props: any) {
  const { window } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
    document.querySelector(`meta[name="theme-color"]`) &&
      document
        .querySelector(`meta[name="theme-color"]`)!
        .setAttribute(
          "content",
          open
            ? global.theme === "dark"
              ? "hsl(240, 11%, 10%)"
              : "#808080"
            : global.theme === "dark"
            ? "hsl(240, 11%, 10%)"
            : "#fff"
        );
  }, [open]);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: "auto",
            overflow: "visible",
          },
        }}
      />
      <Tooltip title="My account" placement="bottom-end">
        <IconButton
          disableRipple
          onClick={toggleDrawer(true)}
          color="inherit"
          aria-label="open drawer."
          edge="end"
          sx={{
            ml: -0.3,
            transform: "scale(.7)",
            transition: "none",
            color: "#404040",
            "&:hover": { color: "#000" },
          }}
        >
          {global.session ? (
            <Avatar
              sx={{
                fontSize: "15px",
                bgcolor: colors[themeColor][200],
                transform: "scale(1.2)",
              }}
              alt="Profie picture"
              src={global.session.user.image}
            />
          ) : (
            <Skeleton
              variant="circular"
              animation="wave"
              width={40}
              height={40}
            />
          )}
        </IconButton>
      </Tooltip>
      <SwipeableDrawer
        container={container}
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        sx={{
          "& .MuiBackdrop-root": {
            opacity: { sm: "0!important" },
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            background:
              global.theme === "dark"
                ? "rgba(68, 68, 85,0.9)"
                : "rgba(255,255,255,.8)",
            backdropFilter: "blur(10px)",
            p: 3,
            py: 5,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`,
            width: {
              xs: "calc(100vw - 30px)",
              sm: "400px",
            },
            mb: "10px",
            ml: {
              xs: "10px",
              sm: "auto",
            },
            borderRadius: "15px",
            mx: "auto",
            position: "fixed",
            top: "70px",
            bottom: "auto",
            left: "auto",
            right: "15px",
          },
        }}
      >
        <Accounts setOpen={setOpen} />
      </SwipeableDrawer>
    </Root>
  );
}
