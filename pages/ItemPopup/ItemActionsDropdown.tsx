import * as React from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ItemDetails } from "./ItemDetails";

export function ItemActionsDropdown({ itemData }: { itemData: any }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip enterDelay={1000} leaveDelay={200} title="More actions">
        <IconButton
          size="large"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          aria-label="more"
          edge="end"
          color="inherit"
          sx={{ ml: 1, mr: -1 }}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button"
        }}
      >
        <ItemDetails itemData={itemData}>
          <MenuItem>Info</MenuItem>
        </ItemDetails>
        <MenuItem
          onClick={() => {
            handleClose();
            window.navigator.share({
              text: `I have ${itemData.amount} ${itemData.title} in my inventory`
            });
          }}
        >
          Share
        </MenuItem>
        <MenuItem onClick={handleClose}>WhatsApp</MenuItem>
        <MenuItem onClick={handleClose}>Find recipes</MenuItem>
        <MenuItem onClick={handleClose}>Invite collaborators</MenuItem>
        <MenuItem onClick={handleClose}>Add to shopping list</MenuItem>
        <MenuItem onClick={handleClose}>Move to</MenuItem>
        <MenuItem onClick={handleClose}>Create QR code</MenuItem>
      </Menu>
    </div>
  );
}
