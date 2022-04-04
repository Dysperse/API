import * as React from "react";
import Link from "next/link";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import LabelIcon from "@mui/icons-material/Label";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import RoomIcon from "@mui/icons-material/Room";

function ListItem({
  href = "/dashboard",
  asHref = "/dashboard",
  text,
  icon
}: any) {
  return (
    <Link href={href} as={asHref}>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </Link>
  );
}

export function DrawerListItems({ handleDrawerToggle }: any) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: "100%" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "block"
          }
        }}
      >
        <Toolbar />
      </Box>
      <div onClick={handleDrawerToggle}>
        <ListSubheader>Home</ListSubheader>
        <ListItem text="Overview" icon={<LabelIcon />} />
        <ListItem
          href="/finances"
          asHref="/finances"
          text="Finances"
          icon={<LabelIcon />}
        />
        <ListItem text="Meals" icon={<LabelIcon />} />
      </div>
      <div onClick={handleDrawerToggle}>
        <ListSubheader>Rooms</ListSubheader>
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/kitchen"
          text="Kitchen"
          icon={<LabelIcon />}
        />
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/bedroom"
          text="Bedroom"
          icon={<LabelIcon />}
        />
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/bathroom"
          text="Bathroom"
          icon={<LabelIcon />}
        />
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/garage"
          text="Garage"
          icon={<LabelIcon />}
        />
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/dining"
          text="Dining room"
          icon={<LabelIcon />}
        />
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/living-room"
          text="Living room"
          icon={<LabelIcon />}
        />
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/laundry-room"
          text="Laundry room"
          icon={<LabelIcon />}
        />
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/storage-room"
          text="Storage room"
          icon={<LabelIcon />}
        />
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/camping"
          text="Camping"
          icon={<LabelIcon />}
        />
        <ListItem
          href="/rooms/[index]"
          asHref="/rooms/garden"
          text="Garden"
          icon={<LabelIcon />}
        />
      </div>

      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <RoomIcon />
        </ListItemIcon>
        <ListItemText primary="More rooms" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        onClick={handleDrawerToggle}
      >
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Create room" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListSubheader component="div" id="nested-list-subheader">
        More
      </ListSubheader>
      <ListItem
        href="/notes"
        asHref="/notes"
        text="Notes"
        icon={<LabelIcon />}
      />
      <ListItem text="Home maintenance" icon={<LabelIcon />} />
      <ListItem
        href="/starred"
        asHref="/starred"
        text="Starred items"
        icon={<LabelIcon />}
      />
      <ListItem
        href="/trash"
        asHref="/trash"
        text="Trash"
        icon={<LabelIcon />}
      />
    </List>
  );
}
