import * as React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import Grow from "@mui/material/Grow";
import { TransitionProps } from "@mui/material/transitions";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// import EditorJS from "@editorjs/editorjs";
// const Editor = new EditorJS("editorjs");

function MoreDropdown() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        onClick={handleClick}
        sx={{
          background: "#eee",
          "&:hover": {
            background: "#ddd"
          }
        }}
        aria-label="close"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuItem onClick={handleClose}>
          <DeleteIcon sx={{ mr: 1.5 }} />
          Delete note
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <AutoAwesomeIcon sx={{ mr: 1.5 }} />
          What's new?
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <DownloadIcon sx={{ mr: 1.5 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <PrintIcon sx={{ mr: 1.5 }} />
          Print
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ShareIcon sx={{ mr: 1.5 }} />
          Share
        </MenuItem>
      </Menu>
    </>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Grow in={true} ref={ref} {...props} />;
});

export default function NoteModal(props: any) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    document.body.classList.add("prevent-scroll");
  };

  const handleClose = () => {
    setOpen(false);
    document.body.classList.remove("prevent-scroll");
  };

  return (
    <div>
      <div onClick={handleClickOpen}>{props.children}</div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar
          sx={{
            position: "fixed",
            color: "#000",
            background: "transparent",
            py: 1.5,
            px: 1
          }}
          elevation={0}
        >
          <Toolbar>
            <IconButton
              edge="end"
              autoFocus
              sx={{
                background: "#eee",
                ml: -1,
                "&:hover": {
                  background: "#ddd"
                }
              }}
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 1, flex: 1 }}
              variant="h6"
              component="div"
            ></Typography>
            <MoreDropdown />
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            zIndex: 1,
            width: "100vw",
            height: "300px"
          }}
        >
          <img
            src={props.banner}
            style={{
              objectFit: "cover"
            }}
            width="100%"
            alt="Banner"
            height="100%"
          />
        </Box>
        <Box
          sx={{
            p: 2,
            zIndex: 1,
            mx: "auto",
            borderRadius: "15px",
            px: "30px",
            py: "20px",
            background: "white",
            mt: "-100px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            mb: "50px",
            width: {
              sm: "70vw"
            }
          }}
        >
          <TextField
            id="outlined-basic"
            placeholder="Note title"
            variant="standard"
            fullWidth
            sx={{ mb: 1 }}
            InputProps={{ disableUnderline: true, style: { fontSize: 50 } }}
            defaultValue={props.title}
          />
          <TextField
            id="outlined-basic"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            multiline
            fullWidth
            defaultValue={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Dolor tempus risus lobortis volutpat laoreet duis vestibulum ipsum condimentum purus, etiam per, platea congue vitae tristique nibh, eu dapibus. Maecenas aliquam molestie sociosqu lacinia ut suscipit commodo justo et iaculis potenti ante platea pellentesque consectetur aptent sagittis sollicitudin curae. Fusce metus ut pharetra lobortis porttitor vivamus nam eget consequat mauris purus nunc at eget, vestibulum felis semper, malesuada ipsum.

Odio sed diam sem semper augue nibh pretium consectetur ut, a at, quis at in consequat augue odio cras senectus. Fringilla sed sociosqu venenatis, aenean ante condimentum adipiscing ullamcorper blandit lacinia, curabitur quam elementum habitant tincidunt inceptos nullam sed a. Aptent aliquet quisque tellus cubilia arcu tellus ornare adipiscing turpis metus eros amet sollicitudin porta quisque eros netus mi tellus.`}
          />
        </Box>
        {/* <Editor /> */}
      </Dialog>
    </div>
  );
}
