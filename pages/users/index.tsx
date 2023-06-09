import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  Icon,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

export default function Page() {
  const session = useSession();
  const router = useRouter();

  const { data, error } = useApi("user/profile/friends", {
    email: session.user.email,
  });

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%)`,
        zIndex: 999,
        overflow: "auto",
      }}
    >
      <AppBar
        position="sticky"
        sx={{
          background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%,0.5)`,
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 2 } }}>
          <IconButton onClick={() => router.push("/zen")}>
            <Icon>west</Icon>
          </IconButton>
          <Typography
            sx={{
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data ? data.user.name : "Profile"}
          </Typography>
        </Toolbar>
      </AppBar>
      {data ? (
        <>
          <ListItemButton sx={{ gap: 2 }}>
            <Avatar
              src={data.user?.Profile?.picture}
              sx={{
                height: 50,
                width: 50,
                fontSize: 20,
                textTransform: "uppercase",
                background: `linear-gradient(${
                  colors[session.themeColor][200]
                } 30%, ${colors[session.themeColor][300]})`,
              }}
            >
              {data.user.name.trim().charAt(0)}
              {data.user.name.includes(" ")
                ? data.user.name.split(" ")[1].charAt(0)
                : data.user.name.charAt(1)}
            </Avatar>
            <ListItemText
              primary={session.user.name}
              secondary={session.user.email}
            />
            <ListItemIcon>
              <Icon>arrow_forward_ios</Icon>
            </ListItemIcon>
          </ListItemButton>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {JSON.stringify(data)}
    </Box>
  );
}
