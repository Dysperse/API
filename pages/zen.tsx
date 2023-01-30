import {
  Box,
  Divider,
  Icon,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const time = new Date().getHours();
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
        <Box>
          <Typography
            className="font-heading"
            sx={{
              fontSize: {
                xs: "40px",
                sm: "35px",
              },
              my: 2,
              mt: -5,
              textDecoration: "underline",
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
                  ? "hsla(240,11%,40%,.2)"
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

          <Typography
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              px: 3,
              background: global.user.darkMode
                ? "hsla(240,11%,20%,.6)"
                : "rgba(200,200,200,.3)",
              borderRadius: 9,
              py: 1,
              color: "warning.main",
            }}
          >
            <Icon>local_fire_department</Icon> 10 days
          </Typography>

          <List
            sx={{
              mt: 2,
              "& .MuiListItemButton-root": {
                borderRadius: 3,
                mb: 0.1,
                gap: 2,
                px: 1,
              },
            }}
          >
            <ListItemButton onClick={() => router.push("/tasks")}>
              <ListItemText
                primary="Tasks"
                secondary="Daily goal: 4/7 completed"
              />
            </ListItemButton>
            <ListItemButton onClick={() => router.push("/coach")}>
              <ListItemText primary="Goals" secondary="7 tasks remaining" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <Box>
              <ListItemButton>
                <Icon className="outlined">school</Icon>
                <ListItemText
                  primary="Create a study plan"
                  secondary="Have a test or quiz?"
                />
              </ListItemButton>
              <ListItemButton>
                <Icon className="outlined">view_in_ar</Icon>
                <ListItemText primary="Scan items" />
              </ListItemButton>
              <ListItemButton
                onClick={() =>
                  document.getElementById("achievementsTrigger")?.click()
                }
              >
                <Icon className="outlined">insights</Icon>
                <ListItemText primary="Achievements" />
              </ListItemButton>
              <ListItemButton
                onClick={() =>
                  document.getElementById("settingsTrigger")?.click()
                }
              >
                <Icon className="outlined">settings</Icon>
                <ListItemText primary="Account" />
              </ListItemButton>
            </Box>
          </List>
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
