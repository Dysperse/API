import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { handleBack } from "@/lib/client/handleBack";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Avatar,
  Box,
  Icon,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";

function sendMessage(message) {
  return new Promise(function (resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function (event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };
    navigator?.serviceWorker?.controller?.postMessage(message, [
      messageChannel.port2,
    ]);
  });
}

function Page() {
  const router = useRouter();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const styles = {
    "&:hover": {
      background: { sm: palette[3] + "!important" },
    },
    "&:active": {
      background: palette[3] + "!important",
    },
    "& *": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  };

  const groupPalette = useColor(session.property.profile.color, isDark);

  const clearCache = async () => {
    if ("serviceWorker" in navigator) {
      await caches.keys().then(function (cacheNames) {
        cacheNames.forEach(async function (cacheName) {
          await caches.delete(cacheName);
        });
      });
      window.location.reload();
    }
  };

  return (
    <>
      <TextField
        variant="standard"
        onClick={() => toast("Coming soon!")}
        placeholder="Search..."
        InputProps={{
          readOnly: true,
          disableUnderline: true,
          sx: {
            background: palette[2],
            "&:focus-within": {
              background: palette[3],
            },
            transition: "all .2s",
            mb: 2,
            px: 2,
            py: 0.3,
            borderRadius: 3,
          },
          startAdornment: (
            <InputAdornment position="start">
              <Icon>search</Icon>
            </InputAdornment>
          ),
        }}
      />
      <ListItemButton
        onClick={() => router.push("/settings/profile")}
        sx={{
          background: palette[2] + "!important",
          mb: 2,
          ...styles,
        }}
      >
        <ProfilePicture data={session.user} size={40} />
        <ListItemText
          primary={<b>{session.user.name}</b>}
          secondary="Account settings"
        />
        <Icon sx={{ color: palette[11] }}>arrow_forward_ios</Icon>
      </ListItemButton>
      <ListItemButton
        sx={{
          background: palette[2] + "!important",
          ...styles,
          mb: 2,
        }}
        onClick={() => router.push("/spaces/" + session.property.propertyId)}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: `linear-gradient(45deg, ${groupPalette[8]}, ${groupPalette[6]})`,
            color: groupPalette[11],
          }}
        >
          <Icon>
            {session.property.profile.type === "home"
              ? "home"
              : session.property.profile.type === "apartment"
              ? "apartment"
              : session.property.profile.type === "dorm"
              ? "cottage"
              : "school"}
          </Icon>
        </Avatar>
        <ListItemText
          primary={<b>{session.property.profile.name}</b>}
          secondary="My group"
        />
        <Icon sx={{ color: palette[11] }}>arrow_forward_ios</Icon>
      </ListItemButton>
      <Box sx={{ background: palette[2], borderRadius: 3, mb: 2 }}>
        {[
          { icon: "palette", text: "Appearance" },
          { icon: "hub", text: "Connections" },
          { icon: "change_history", text: "Login activity" },
          { icon: "notifications", text: "Notifications" },
          { icon: "lock", text: "2FA" },
        ].map((button) => (
          <ListItemButton
            key={button.icon}
            onClick={() => {
              router.push(
                `/settings/${button.text.toLowerCase().replaceAll(" ", "-")}`
              );
            }}
            sx={styles}
          >
            <Icon className="outlined" sx={{ color: palette[11] }}>
              {button.icon}
            </Icon>
            <ListItemText primary={button.text} />
            <Icon sx={{ color: palette[11] }}>arrow_forward_ios</Icon>
          </ListItemButton>
        ))}
        <ConfirmationModal
          title="Sign out"
          question="Are you sure you want to sign out?"
          buttonText="Sign out"
          callback={() =>
            fetchRawApi(session, "auth/logout").then(() => router.push("/auth"))
          }
        >
          <ListItemButton>
            <Icon sx={{ color: palette[11] }}>logout</Icon>
            <ListItemText primary="Sign out" />
            <Icon sx={{ color: palette[11] }}>arrow_forward_ios</Icon>
          </ListItemButton>
        </ConfirmationModal>
      </Box>
      <Box
        sx={{
          background: palette[2],
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {[
          {
            name: "Privacy policy",
            icon: "link",
            href: "//blog.dysperse.com/privacy-policy",
          },
          {
            name: "Terms of service",
            icon: "link",
            href: "//blog.dysperse.com/terms-of-service",
          },
          {
            name: "Support",
            icon: "help",
            href: "//blog.dysperse.com/series/support",
          },
          {
            name: `Version ${session.user.lastReleaseVersionViewed}`,
            icon: "info",
            href: `//github.com/dysperse/dysperse`,
          },
        ].map(({ name, icon, href }) => (
          <ListItem key={name} onClick={() => window.open(href)} sx={styles}>
            <Icon className="outlined" sx={{ color: palette[11] }}>
              {icon}
            </Icon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
        <ListItemButton onClick={clearCache}>
          <Icon sx={{ color: palette[11] }}>sync</Icon>
          <ListItemText primary="Clear cache and reload" />
        </ListItemButton>
      </Box>
    </>
  );
}

export default function Layout({ children }: any) {
  const router = useRouter();
  const closeRef: any = useRef();

  useHotkeys("esc", () => closeRef.current?.click());

  return (
    <Box>
      <Box>
        <AppBar
          sx={{
            pr: 5,
            background: "transparent",
            border: 0,
            position: "fixed",
            top: 0,
            left: { xs: 0, sm: "85px" },
          }}
        >
          <Toolbar>
            <IconButton onClick={() => handleBack(router)}>
              <Icon>arrow_back_ios_new</Icon>
            </IconButton>
            {router.asPath !== "/settings" && (
              <Typography sx={{ ml: 1 }}>
                <b>Settings</b>
              </Typography>
            )}
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            p: { xs: 3, sm: 0 },
            width: "100%",
            height: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            maxWidth: "500px",
            mx: "auto",
          }}
        >
          <Typography
            variant="h2"
            sx={{ mb: 1, mt: 15 }}
            className="font-heading"
          >
            {capitalizeFirstLetter(
              router.asPath
                .replace("/settings", "")
                .replaceAll("-", " ")
                .replaceAll("/", "") || "Settings"
            )}
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              height: "100%",
              width: "100%",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              key="settings"
              style={{ marginBottom: "40px" }}
            >
              {children || <Page />}
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
