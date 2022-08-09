import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { CreateGoalMenu } from "./CreateGoalMenu";

export function Navbar({ setOpen, scrollTop, container, account }: any) {
  return (
    <>
      <AppBar
        position="absolute"
        sx={{
          background: scrollTop > 300 ? "#091f1e" : "transparent",
          transition: "backdrop-filter .2s, background .2s",
          color: "#fff",
          borderTopLeftRadius: { sm: "20px" },
          borderTopRightRadius: { sm: "20px" },
          ...(scrollTop > 100 && {
            backdropFilter: "blur(10px)",
          }),
          boxShadow: 0,
          p: 0.5,
          py: 1,
        }}
      >
        <Toolbar>
          <Tooltip title="Back">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="menu"
              sx={{
                mr: -1,
                "&:hover": { background: "rgba(255,255,255,.1)" },
                transition: "none",
              }}
              disableRipple
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </IconButton>
          </Tooltip>
          <Typography sx={{ flexGrow: 1, textAlign: "center" }} component="div">
            Overview
          </Typography>
          <CreateGoalMenu scrollTop={scrollTop} account={account} />
        </Toolbar>
      </AppBar>
    </>
  );
}
