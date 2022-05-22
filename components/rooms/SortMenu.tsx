import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as colors from "@mui/material/colors";
import FilterListIcon from "@mui/icons-material/FilterList";

export function SortMenu({ items, setItems, data }: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        variant="contained"
        disableElevation
        sx={{
          borderRadius: 10,
          ml: 1,
          mt: { xs: 1, sm: 0 },
          py: 1,
          verticalAlign: "middle",
        }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <FilterListIcon sx={{ mr: 1.5 }} />
        Sort by
      </Button>
      <Menu
        BackdropProps={{ sx: { opacity: "0!important" } }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          transition: "all .2s",
          "& .MuiPaper-root": {
            borderRadius: "15px",
            minWidth: 180,
            boxShadow: 0,
            background: colors[global.themeColor][100],

            color: colors[global.themeColor][800],
            "& .MuiMenu-list": {
              padding: "4px",
            },
            "& .MuiMenuItem-root": {
              "&:hover": {
                background: colors[global.themeColor][200],
                color: colors[global.themeColor][900],
                "& .MuiSvgIcon-root": {
                  color: colors[global.themeColor][800],
                },
              },
              padding: "10px 15px",
              borderRadius: "15px",
              marginBottom: "1px",
              transition: "all .05s",

              "& .MuiSvgIcon-root": {
                fontSize: 25,
                color: colors[global.themeColor][700],
                marginRight: 1.9,
              },
              "&:active": {
                background: colors[global.themeColor][300],
              },
            },
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem disableRipple onClick={() => {
          
          handleClose();
        }}>
          A-Z
        </MenuItem>
        <MenuItem disableRipple onClick={handleClose}>
          Z-A
        </MenuItem>
        <MenuItem disableRipple onClick={handleClose}>
          Last updated
        </MenuItem>
      </Menu>
    </>
  );
}
