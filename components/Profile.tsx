import React, { useEffect } from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import Settings from "./Settings/index";

const drawerBleeding = 0;

const Root = styled("div")(({ theme }) => ({
  height: "100%"
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "transparent" : grey[800]
}));

function Accounts({ setOpen }: any) {
  return (
    <List sx={{ width: "100%", bgcolor: "transparent" }}>
      <ListItem
        secondaryAction={
          <div onClick={() => setOpen(false)}>
            <Settings />
          </div>
        }
      >
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src={global.session ? global.session.user.image : null}
          />
        </ListItemAvatar>
        <ListItemText
          primary={global.session && global.session.user.name}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {global.session && global.session.user.email}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
}

export function ProfileMenu(props: any) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute(
        "content",
        open
          ? global.theme === "dark"
            ? "#101010"
            : "#808080"
          : global.theme === "dark"
          ? "#101010"
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
            overflow: "visible"
          }
        }}
      />
      <Tooltip title="My account" placement="bottom-end">
        <IconButton
          onClick={toggleDrawer(true)}
          color="inherit"
          aria-label="open drawer."
          edge="end"
        >
          {global.session ? (
            <Avatar
              sx={{ fontSize: "15px", bgcolor: deepOrange[500] }}
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
            opacity: { sm: "0!important" }
          }
        }}
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            border: "1px solid rgba(200,200,200,.2)",
            boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
            width: {
              xs: "calc(100vw - 20px)",
              sm: "400px"
            },
            mb: "10px",
            ml: {
              xs: "10px",
              sm: "auto"
            },
            borderRadius: "15px",
            mx: "auto",
            position: "fixed",
            top: "70px",
            bottom: "auto",
            left: "auto",
            right: "15px"
          }
        }}
      >
        <StyledBox
          sx={{
            top: 0,
            background: "transparent",
            borderRadius: 9,
            visibility: "visible",
            right: 0,
            left: 0
          }}
        >
          <Typography
            sx={{
              textTransform: { sm: "uppercase" },
              fontSize: { sm: "13px" },
              p: 2,
              pb: { sm: 0 },
              color: "text.secondary",
              textAlign: { sm: "right" }
            }}
          >
            Accounts
          </Typography>
        </StyledBox>

        <Accounts setOpen={setOpen} />
      </SwipeableDrawer>
    </Root>
  );
}
