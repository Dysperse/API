import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import { toastStyles } from "@/lib/client/useTheme";
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
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";

function Page() {
  const router = useRouter();
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const { data, url, error } = useApi("user/profile", {
    email: session.user.email,
  });

  const groupPalette = useColor(session.property.profile.color, isDark);

  return (
    <>
      <TextField
        variant="standard"
        onClick={() => toast("Coming soon!", toastStyles)}
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
          "&:hover": {
            background: { sm: palette[3] + "!important" },
          },
          "&:active": {
            background: palette[3] + "!important",
          },
          mb: 2,
          "& *": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
      >
        {data && <ProfilePicture data={data} mutationUrl={url} size={40} />}
        <ListItemText
          primary={<b>{session.user.name}</b>}
          secondary="Account settings"
        />
        <Icon sx={{ color: palette[8] }}>chevron_right</Icon>
      </ListItemButton>
      <ListItemButton
        sx={{
          background: palette[2] + "!important",
          "&:hover": {
            background: { sm: palette[3] + "!important" },
          },
          "&:active": {
            background: palette[3] + "!important",
          },
          mb: 2,
          "& *": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
        onClick={() => router.push("/groups/" + session.property.propertyId)}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: `linear-gradient(45deg, ${groupPalette[8]}, ${groupPalette[6]})`,
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
        <Icon sx={{ color: palette[8] }}>chevron_right</Icon>
      </ListItemButton>
      <Box sx={{ background: palette[2], borderRadius: 3, mb: 2 }}>
        {[
          { icon: "palette", text: "Appearance" },
          { icon: "change_history", text: "Login activity" },
          { icon: "notifications", text: "Notifications" },
          { icon: "lock", text: "2FA" },
          { icon: "restart_alt", text: "Onboarding" },
        ].map((button) => (
          <ListItemButton
            key={button.icon}
            onClick={() => {
              router.push(
                button.text === "onboarding"
                  ? "/onboarding"
                  : `/settings/${button.text
                      .toLowerCase()
                      .replaceAll(" ", "-")}`
              );
            }}
            sx={{
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
            }}
          >
            <Icon className="outlined">{button.icon}</Icon>
            <ListItemText primary={button.text} />
            <Icon sx={{ color: palette[8] }}>chevron_right</Icon>
          </ListItemButton>
        ))}
        <ConfirmationModal
          title="Sign out"
          question="Are you sure you want to sign out?"
          buttonText="Sign out"
          callback={() =>
            fetchRawApi(session, "auth/logout").then(() =>
              mutate("/api/session")
            )
          }
        >
          <ListItemButton>
            <Icon>logout</Icon>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </ConfirmationModal>
      </Box>
      <Box sx={{ background: palette[2], borderRadius: 3 }}>
        <ListItem>
          <Icon className="outlined">link</Icon>
          <ListItemText primary="Privacy policy" />
        </ListItem>
        <ListItem>
          <Icon className="outlined">link</Icon>
          <ListItemText primary="Terms of service" />
        </ListItem>
        <ListItem>
          <Icon className="outlined">help</Icon>
          <ListItemText primary="Support" />
        </ListItem>
      </Box>
    </>
  );
}

export default function Layout({ children }: any) {
  const session = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(session.themeColor, isDark);
  useStatusBar(palette[2]);

  const closeRef: any = useRef();
  useHotkeys("esc", () => closeRef.current?.click());

  const styles = (condition: boolean) => ({
    cursor: { sm: "unset!important" },
    transition: "none!important",
    px: 1.5,
    gap: 1.5,
    py: 1,
    mr: 1,
    mb: 0.3,
    width: "100%",
    fontSize: "15px",
    justifyContent: "flex-start",
    borderRadius: 4,
    color: palette[12],
    "&:hover, &:focus": {
      background: palette[3],
    },
    "& span": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      minWidth: 0,
    },
    ...(condition && {
      color: palette[12],
      background: palette[4],
      "&:hover, &:focus": {
        background: palette[5],
      },
    }),
  });

  const isMobile = useMediaQuery("(max-width: 900px)");

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        top: 0,
        width: "100vw",
        left: 0,
        zIndex: 999,
        background: palette[1],
      }}
    >
      <Box
        sx={{
          maxHeight: "100dvh",
          minHeight: "100dvh",
          height: "100dvh",
          overflowY: "auto",
          flexGrow: 1,
          p: { xs: 0, sm: 5 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          key="settings"
        >
          <AppBar
            sx={{
              pr: 5,
              background: "transparent",
              border: 0,
              position: "fixed",
              top: 0,
              left: 0,
            }}
          >
            <Toolbar>
              <IconButton
                onClick={() =>
                  router.push(router.asPath === "/settings" ? "/" : "/settings")
                }
              >
                <Icon>arrow_back_ios_new</Icon>
              </IconButton>
              {router.asPath !== "/settings" && (
                <Typography sx={{ ml: 1 }}>
                  <b>Settings</b>
                </Typography>
              )}
            </Toolbar>
          </AppBar>
          <Box sx={{ p: { xs: 3, sm: 0 }, height: "100%" }}>
            <Typography
              variant="h2"
              sx={{ mb: 1, mt: 8 }}
              className="font-heading"
            >
              {capitalizeFirstLetter(
                router.asPath
                  .replace("/settings", "")
                  .replaceAll("-", " ")
                  .replaceAll("/", "") || "Settings"
              )}
            </Typography>
            {children || <Page />}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
