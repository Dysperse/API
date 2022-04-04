import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import { ItemActionsDropdown } from "./ItemActionsDropdown";
import { DeleteModal } from "./DeleteModal";
import { EditPopup } from "./EditPopup";

export function Navbar({ itemData, toggleDrawer }) {
  return (
    <>
      <AppBar
        sx={{
          width: {
            lg: "45vw",
            sm: "100vw",
            xs: "100vw",
            md: "90vw"
          },
          py: 1,
          backgroundColor: "white",
          color: "text.primary",
          boxShadow: 0
        }}
      >
        <Toolbar>
          <Tooltip enterDelay={1000} leaveDelay={200} title="Back to room">
            <IconButton
              color="inherit"
              size="large"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(false)}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Tooltip enterDelay={1000} leaveDelay={200} title="Star">
            <IconButton
              size="large"
              aria-label="search"
              edge="end"
              color="inherit"
              sx={{ ml: 1, mr: 0 }}
            >
              <StarIcon />
            </IconButton>
          </Tooltip>
          <EditPopup itemData={itemData}>
            <Tooltip enterDelay={1000} leaveDelay={200} title="Edit">
              <IconButton
                size="large"
                aria-label="search"
                edge="end"
                color="inherit"
                sx={{ ml: 1, mr: 0 }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </EditPopup>
          <DeleteModal />
          <ItemActionsDropdown itemData={itemData} />
        </Toolbar>
      </AppBar>
    </>
  );
}
