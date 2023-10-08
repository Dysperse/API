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
  ListItemButton,
  ListItemText,
  SxProps,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type SettingsButtons = {
  icon: String | JSX.Element;
  text: any;
  secondary?: string;
  path?: string;
  queries: string[];
  sx?: SxProps;
  onClickConfirmation?: {
    title: string;
    question: string;
    success: () => void;
  };
}[][];

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

  const [query, setQuery] = useState("");

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

  const sections: SettingsButtons = [
    [
      {
        icon: <ProfilePicture data={session.user} size={40} />,
        text: session.user.name,
        secondary: "Account settings",
        path: "/settings/profile",
        queries: [
          "profile picture",
          "name",
          "email",
          "password",
          "bio",
          "about",
        ],
        sx: {
          background: palette[2] + "!important",
          mb: 2,
          ...styles,
        },
      },
    ],
    [
      {
        text: session.property.profile.name,
        secondary: "My group",
        path: "/spaces/" + session.property.propertyId,
        icon: (
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
        ),
        sx: {
          background: palette[2] + "!important",
          ...styles,
          mb: 2,
        },
        queries: ["group", "space", "name"],
      },
    ],
    [
      {
        icon: "palette",
        text: "Appearance",
        queries: ["theme", "mode", "color"],
      },
      { icon: "hub", text: "Connections", queries: ["google", "spotify"] },
      {
        icon: "change_history",
        text: "Login activity",
        queries: ["session", "logout"],
      },
      {
        icon: "notifications",
        text: "Notifications",
        queries: ["reminders", "alerts"],
      },
      {
        icon: "lock",
        text: "2FA",
        queries: ["two factor authentication", "otp", "code"],
      },
      {
        icon: "logout",
        text: "Sign out",
        queries: ["sign out", "log out"],
        onClickConfirmation: {
          title: "Log out?",
          question: "You'll have to sign back in later",
          success: () =>
            fetchRawApi(session, "auth/logout").then(() =>
              router.push("/auth")
            ),
        },
      },
    ],

    [
      {
        text: "Privacy policy",
        icon: "link",
        path: "//blog.dysperse.com/privacy-policy",
        queries: ["privacy policy"],
      },
      {
        text: "Terms of service",
        icon: "link",
        path: "//blog.dysperse.com/terms-of-service",
        queries: ["terms and conditions"],
      },
      {
        text: "Support",
        icon: "help",
        path: "//blog.dysperse.com/series/support",
        queries: ["help"],
      },
      {
        text: `Version ${session.user.lastReleaseVersionViewed}`,
        icon: "info",
        path: `//github.com/dysperse/dysperse`,
        queries: ["version"],
      },
      {
        icon: "sync",
        text: "Clear app cache",
        queries: ["cache", "reload"],
        onClickConfirmation: {
          title: "Clear cache?",
          question: "Dysperse will refresh. This might take some time",
          success: clearCache,
        },
      },
    ],
  ];

  const filteredSections = sections
    .map((section) => {
      const filteredButtons = section.filter((button) => {
        return button.queries.some((queryPart) => {
          return queryPart.toLowerCase().includes(query);
        });
      });

      // Only keep the section if it has at least one matching button
      if (filteredButtons.length > 0) {
        return filteredButtons;
      }

      return null; // Filter out sections with no matching buttons
    })
    .filter((section) => section !== null); // Filter out null sections

  return (
    <>
      <TextField
        variant="standard"
        value={query}
        onChange={(e: any) => setQuery(e.target.value)}
        placeholder="Search..."
        InputProps={{
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

      {filteredSections.map((section, sectionIndex) => (
        <Box
          sx={{ background: palette[2], borderRadius: 3, mb: 2 }}
          key={sectionIndex}
        >
          {section &&
            section.map((button) => (
              <ConfirmationModal
                disabled={typeof button.onClickConfirmation == "undefined"}
                callback={
                  button.onClickConfirmation
                    ? button.onClickConfirmation.success
                    : () => {
                        if (button.path?.includes("//")) {
                          window.open(button.path);
                        } else {
                          router.push(
                            button.path ||
                              `/settings/${button.text
                                .toLowerCase()
                                .replaceAll(" ", "-")}`
                          );
                        }
                      }
                }
                title={button.onClickConfirmation?.title || ""}
                question={button.onClickConfirmation?.question}
              >
                <ListItemButton key={button.text} sx={styles}>
                  {typeof button.icon === "string" ? (
                    <Icon className="outlined" sx={{ color: palette[11] }}>
                      {button.icon}
                    </Icon>
                  ) : (
                    button.icon
                  )}
                  <ListItemText
                    primary={button.text}
                    {...(button.secondary && { secondary: button.secondary })}
                  />
                  <Icon sx={{ color: palette[11] }}>arrow_forward_ios</Icon>
                </ListItemButton>
              </ConfirmationModal>
            ))}
        </Box>
      ))}
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
