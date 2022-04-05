import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import Settings from "./Settings";

const drawerBleeding = 10;

const Root = styled("div")(({ theme }) => ({
  height: "100%"
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800]
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)"
}));

const Accounts = React.memo(function Accounts() {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem secondaryAction={<Settings />}>
        <ListItemButton alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={ACCOUNT_DATA.image} />
          </ListItemAvatar>
          <ListItemText
            primary={ACCOUNT_DATA.name}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {ACCOUNT_DATA.email}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
});

export function ProfileMenu(props: any) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);

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
      <IconButton
        onClick={toggleDrawer(true)}
        color="inherit"
        aria-label="open drawer."
        edge="end"
      >
        <Avatar sx={{ fontSize: "15px", bgcolor: deepOrange[500] }}>MG</Avatar>
      </IconButton>

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true
        }}
      >
        <StyledBox
          sx={{
            top: 0,
            background: "white",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            Accounts
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto"
          }}
        >
          <Accounts />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}
