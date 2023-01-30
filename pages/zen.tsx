import { openSpotlight } from "@mantine/spotlight";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Icon,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { useRouter } from "next/router";
import React, { useState } from "react";

const CardOptions = React.memo(function CardOptions() {
  return (
    <Box>
      <IconButton>
        <Icon>north</Icon>
      </IconButton>
      <IconButton>
        <Icon className="outlined">delete</Icon>
      </IconButton>
      <IconButton>
        <Icon>south</Icon>
      </IconButton>
    </Box>
  );
});

export default function Home() {
  const router = useRouter();
  const time = new Date().getHours();
  const [editMode, setEditMode] = useState(false);
  let greeting;
  if (time < 10) {
    greeting = "Good morning, ";
  } else if (time < 14) {
    greeting = "Good afternoon, ";
  } else if (time < 18) {
    greeting = "Good evening, ";
  } else {
    greeting = "Good night, ";
  }
  // useEffect(() => {
  //   if (global.user.darkMode) {
  //     setTimeout(() => {
  //       document
  //         .querySelector(`meta[name="theme-color"]`)
  //         ?.setAttribute("content", "hsl(240, 11%, 10%)");
  //     }, 1000);
  //   }
  // }, []);
  return (
    <>
      <div className="px-7 sm:hidden">
        <div className="blur-spotlight" />
        <Box
          sx={{
            mt: "calc(var(--navbar-height) * -1)",
          }}
        >
          <Box sx={{ display: "flex", mb: 2, gap: 1 }}>
            <Tooltip title="Edit start">
              <IconButton
                sx={{
                  ml: "auto",
                  ...(editMode && {
                    background: global.user.darkMode
                      ? "hsl(240,11%,25%)!important"
                      : "rgba(200,200,200,.3)!important",
                  }),
                }}
                onClick={() => setEditMode(!editMode)}
              >
                <Icon className={editMode ? "" : "outlined"}>edit</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Jump to" placement="bottom-start">
              <IconButton onClick={() => openSpotlight()}>
                <Icon className="outlined">search</Icon>
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            className="font-heading"
            sx={{
              fontSize: {
                xs: "40px",
                sm: "35px",
              },
              my: 4,
              mb: 2,
            }}
            variant="h5"
          >
            {greeting}
            {global.user.name.includes(" ")
              ? global.user.name.split(" ")[0]
              : global.user.name}
            !
          </Typography>
          <TextField
            multiline
            placeholder="What's your goal for today?"
            size="small"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                background: global.user.darkMode
                  ? "hsla(240,11%,40%,.35)"
                  : "rgba(200,200,200,.3)",
                "&:focus-within": {
                  background: global.user.darkMode
                    ? "hsla(240,11%,40%,.5)"
                    : "rgba(200,200,200,.3)",
                },
                p: 2,
                py: 1,
                borderRadius: 2,
                mx: "auto",
                mb: 2,
              },
            }}
          />

          <Chip
            icon={
              <>
                <Icon
                  sx={{ color: "inherit!important", ml: 1, mr: -1, mt: -0.2 }}
                  className="outlined"
                >
                  local_fire_department
                </Icon>
              </>
            }
            label="10 days"
            sx={{
              userSelect: "none",
              color: orange["A400"],
              mr: 1,
            }}
          />

          <Collapse in={editMode} orientation="vertical">
            <Button
              variant="contained"
              sx={{
                float: "right",
                opacity: editMode ? 1 : 0,
                transition: "opacity .2s !important",
              }}
            >
              <Icon>add</Icon>Add card
            </Button>
          </Collapse>
          <List
            sx={{
              mt: 2,
              "& .MuiListItemButton-root": {
                ...(editMode && {
                  animation: "jiggle .2s infinite",
                  background: global.user.darkMode
                    ? "hsla(240,11%,20%,.5)"
                    : "rgba(200,200,200,.3)",
                  transformOrigin: "top center",
                }),
                ...(!editMode && {
                  "&:active": {
                    transform: "scale(.98)",
                    transition: "none",
                  },
                }),
                transition: "margin .2s, transform .2s",
                borderRadius: 3,
                mb: !editMode ? 0.2 : 1,
                gap: 2,
                px: 1,
              },
            }}
          >
            <ListItemButton
              disableRipple={editMode}
              onClick={() => !editMode && router.push("/tasks")}
            >
              <Icon>task_alt</Icon>
              <ListItemText
                primary="Tasks"
                secondary="Daily goal: 4/7 completed"
              />
              {editMode && <CardOptions />}
            </ListItemButton>
            <ListItemButton
              disableRipple={editMode}
              onClick={() => !editMode && router.push("/coach")}
            >
              <Icon>routine</Icon>
              <ListItemText primary="Goals" secondary="7 tasks remaining" />
              {editMode && <CardOptions />}
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <Box>
              <ListItemButton disableRipple={editMode}>
                <Icon className="outlined">school</Icon>
                <ListItemText primary="Create a study plan" />
                {editMode && <CardOptions />}
              </ListItemButton>
              <ListItemButton disableRipple={editMode}>
                <Icon className="outlined">star</Icon>
                <ListItemText primary="Starred" />
                {editMode && <CardOptions />}
              </ListItemButton>
              <ListItemButton disableRipple={editMode}>
                <Icon className="outlined">view_in_ar</Icon>
                <ListItemText primary="Scan items" />
                {editMode && <CardOptions />}
              </ListItemButton>
              <ListItemButton
                disableRipple={editMode}
                onClick={() =>
                  !editMode &&
                  document.getElementById("achievementsTrigger")?.click()
                }
              >
                <Icon className="outlined">insights</Icon>
                <ListItemText primary="Achievements" />
                {editMode && <CardOptions />}
              </ListItemButton>
            </Box>
          </List>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Chip
              label="Zen mode is in beta"
              sx={{
                background: "linear-gradient(45deg, #fff, #eee)",
                color: "#000!important",
                userSelect: "none",
              }}
            />
          </Box>
        </Box>
        <Toolbar />
      </div>
      <div className="hidden sm:flex items-center justify-center h-[100vh] flex-col">
        <Icon
          sx={{
            fontSize: "40px!important",
            mb: 2,
            opacity: 0.8,
          }}
        >
          auto_awesome
        </Icon>
        Zen is only available on mobile devices
      </div>
    </>
  );
}
