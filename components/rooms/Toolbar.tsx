import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import { blueGrey } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { CreateItemModal } from "../AddPopup/CreateItemModal";
import { neutralizeBack, revivalBack } from "../history-control";

export function Toolbar({ alias, room, items, setItems, data }: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    open ? neutralizeBack(handleClose) : revivalBack();
  });

  return (
    <Box
      sx={{
        textAlign: "right",
        my: { xs: 2, sm: 5 },
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      <TextField
        placeholder="Search"
        id="outlined-size-small"
        onKeyDown={(e: any) => {
          if (e.code === "Enter") e.target.blur();
        }}
        onBlur={(e: any) => {
          const value = e.target.value;
          if (value === "") {
            setItems(data);
            return;
          }
          setItems([]);
          setTimeout(() => {
            setItems(
              data.filter(
                (x) =>
                  x.title.toLowerCase().includes(value.toLowerCase()) ||
                  x.quantity.toLowerCase().includes(value.toLowerCase()) ||
                  x.categories
                    .join(",")
                    .toLowerCase()
                    .includes(value.toLowerCase())
              )
            );
          }, 50);
        }}
        size="small"
        variant="standard"
        autoComplete="off"
        InputProps={{
          disableUnderline: true,
          sx: {
            borderRadius: "20px",
            border: "0!important",
            pb: 0.6,
            pt: 1,
            mr: 0.5,
            px: 2,
            mt: { xs: 1, sm: 0 },
            width: { xs: "100%", sm: "300px" },
            background:
              global.theme === "dark" ? "hsl(240, 11%, 25%)" : blueGrey[50],
            "&.Mui-focused": {
              background:
                global.theme === "dark" ? "hsl(240, 11%, 30%)" : blueGrey[100],
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
        <span className="material-symbols-rounded">filter_alt</span>
        <Typography
          sx={{
            ml: 1,
            display: {
              xs: "none",
              sm: "inline",
            },
          }}
        >
          &nbsp;Sort&nbsp;by&nbsp;
        </Typography>
      </Button>
      <CreateItemModal room={room} alias={alias} toggleDrawer={() => {}}>
        <Button
          id="basic-button"
          variant="contained"
          disabled={data.length >= 150 || global.property.role === "read-only"}
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
        >
          <span className="material-symbols-rounded">add_circle</span>
          <Typography
            sx={{
              ml: 1,
              display: {
                xs: "none",
                sm: "inline",
              },
            }}
          >
            &nbsp;New&nbsp;item&nbsp;
          </Typography>
        </Button>
      </CreateItemModal>
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
            mt: 1,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            ml: -1,
            borderRadius: "15px",
            minWidth: 180,
            background:
              global.theme === "dark"
                ? colors[global.themeColor][900]
                : colors[global.themeColor][100],

            color:
              global.theme === "dark"
                ? colors[global.themeColor][200]
                : colors[global.themeColor][800],
            "& .MuiMenu-list": {
              padding: "4px",
            },
            "& .MuiMenuItem-root": {
              "&:hover": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][800]
                    : colors[global.themeColor][200],
                color:
                  global.theme === "dark"
                    ? colors[global.themeColor][100]
                    : colors[global.themeColor][900],
                "& .MuiSvgIcon-root": {
                  color:
                    global.theme === "dark"
                      ? colors[global.themeColor][200]
                      : colors[global.themeColor][800],
                },
              },
              padding: "10px 15px",
              borderRadius: "15px",
              marginBottom: "1px",

              "& .MuiSvgIcon-root": {
                fontSize: 25,
                color: colors[global.themeColor][700],
                marginRight: 1.9,
              },
              "&:active": {
                background:
                  global.theme === "dark"
                    ? colors[global.themeColor][700]
                    : colors[global.themeColor][300],
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
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(items.sort((a, b) => a.title.localeCompare(b.title))),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          A-Z
        </MenuItem>
        <MenuItem
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(
                  items.sort((a, b) => a.title.localeCompare(b.title)).reverse()
                ),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          Z-A
        </MenuItem>
        <MenuItem
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(
                  items.sort((a, b) => a.quantity.localeCompare(b.quantity))
                ),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          Quantity
        </MenuItem>
        <MenuItem
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(
                  items
                    .sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated))
                    .reverse()
                ),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          Newest to oldest
        </MenuItem>
        <MenuItem
          onClick={() => {
            setItems([]);
            setTimeout(
              () =>
                setItems(
                  items.sort((a, b) =>
                    a.lastUpdated.localeCompare(b.lastUpdated)
                  )
                ),
              50
            );
            setTimeout(handleClose, 50);
          }}
        >
          Oldest to newest
        </MenuItem>
      </Menu>
    </Box>
  );
}
