import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { CreateItemModal } from "./CreateItemModal";
import LabelIcon from "@mui/icons-material/Label";

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

function AddItemOption({ icon, title }: any): JSX.Element {
  return (
    <CreateItemModal room={title}>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </CreateItemModal>
  );
}
function Content({ toggleDrawer }: any) {
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      onClick={toggleDrawer()}
    >
      <AddItemOption title="Kitchen" icon={<LabelIcon />} />
      <AddItemOption title="Bathroom" icon={<LabelIcon />} />
      <AddItemOption title="Bedroom" icon={<LabelIcon />} />
      <AddItemOption title="Garage" icon={<LabelIcon />} />
      <AddItemOption title="Living room" icon={<LabelIcon />} />
      <AddItemOption title="Dining room" icon={<LabelIcon />} />
      <AddItemOption title="Laundry room" icon={<LabelIcon />} />
      <AddItemOption title="Storage room" icon={<LabelIcon />} />
    </List>
  );
}

export function AddPopup(props: any) {
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
      <Box onClick={toggleDrawer(true)}>{props.children}</Box>

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
          <Typography sx={{ p: 2, color: "text.secondary" }}>Create</Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto"
          }}
        >
          <Content toggleDrawer={toggleDrawer} />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}
