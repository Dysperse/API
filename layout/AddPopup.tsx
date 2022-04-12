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
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={() => {}}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true
        }}
      >
        <Typography sx={{ p: 2, color: "text.secondary" }}>Create</Typography>
        <Content toggleDrawer={toggleDrawer} />
      </SwipeableDrawer>
    </Root>
  );
}
