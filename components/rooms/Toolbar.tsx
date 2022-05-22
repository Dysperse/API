import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { blueGrey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as colors from "@mui/material/colors";
import FilterListIcon from "@mui/icons-material/FilterList";

export function Toolbar({ items, setItems, data }: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ textAlign: "right", mb: 2 }}>
      <TextField
        placeholder="Search"
        id="outlined-size-small"
        onKeyDown={(e: any) => {
          if (e.code === "Enter") e.target.blur();
        }}
        onBlur={(e: any) => {
          if (e.target.value === "") {
            setItems(data);
            return;
          }
          setItems(
            data.filter(
              (item) =>
                item.title
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()) ||
                item.amount
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()) ||
                item.categories
                  .join(",")
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase())
            )
          );
        }}
        size="small"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            borderRadius: "20px",
            border: "0!important",
            pb: 0.6,
            pt: 1,
            px: 2,
            background: blueGrey[50],
            "&.Mui-focused": {
              background: blueGrey[100],
            },
          },
        }}
        sx={{ verticalAlign: "middle" }}
      />
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
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
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
              transition: "none",

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
        <MenuItem
          onClick={() =>
            setItems(items.sort((a, b) => a.title.localeCompare(b.title)))
          }
        >
          A-Z
        </MenuItem>
        <MenuItem
          onClick={() =>
            setItems(
              items.sort((a, b) => a.title.localeCompare(b.title)).reverse()
            )
          }
        >
          Z-A
        </MenuItem>
        <MenuItem
          onClick={() =>
            setItems(items.sort((a, b) => a.amount.localeCompare(b.amount)))
          }
        >
          Quantity
        </MenuItem>
        <MenuItem
          onClick={() =>
            setItems(
              items.sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated))
            )
          }
        >
          Last updated
        </MenuItem>
      </Menu>
    </Box>
  );
}
