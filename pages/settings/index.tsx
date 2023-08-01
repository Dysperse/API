import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";

export default function Layout({ children }: any) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (router.asPath === "/settings") {
      router.push("/settings/profile");
    }
  }, [router]);

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

  const sidebar = (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          marginBottom: "15px",
          gap: 2,
          pt: 1,
          pl: 1,
          fontSize: "35px",
        }}
      >
        <Image
          width={50}
          height={50}
          src="/logo.svg"
          alt="logo"
          style={{
            marginTop: "-1px",
            marginLeft: "-1px",
            ...(isDark && {
              filter: "invert(100%)",
            }),
          }}
        />

        <span className="e font-heading">Settings</span>
      </Box>
      {[
        { icon: "account_circle", text: "Profile" },
        { icon: "palette", text: "Appearance" },
        { icon: "change_history", text: "Login Activity" },
        { icon: "notifications", text: "Notifications" },
        { icon: "lock", text: "Two-factor authentication" },
      ].map((button) => (
        <Button
          key={button.icon}
          onClick={() => {
            setOpen(false);
            setTimeout(() => {
              router.push(
                `/settings/${button.text.toLowerCase().replaceAll(" ", "-")}`
              );
            }, 200);
          }}
          sx={styles(
            router.pathname ===
              `/settings/${button.text.toLowerCase().replaceAll(" ", "-")}`
          )}
        >
          <Icon
            {...(!(
              router.pathname ===
              `/settings/${button.text.toLowerCase().replaceAll(" ", "-")}`
            ) && { className: "outlined" })}
          >
            {button.icon}
          </Icon>
          <span>{button.text}</span>
        </Button>
      ))}
      <Link
        href={`/onboarding`}
        onClick={() => setOpen(false)}
        style={{ display: "block", cursor: "default" }}
      >
        <Button sx={styles(false)}>
          <Icon className="outlined">restart_alt</Icon>
          <span>Onboarding</span>
        </Button>
      </Link>
      <ConfirmationModal
        title="Sign out"
        question="Are you sure you want to sign out?"
        buttonText="Sign out"
        callback={() =>
          fetchRawApi(session, "auth/logout").then(() => mutate("/api/session"))
        }
      >
        <Button sx={{ ...styles(false), mt: "auto" }}>
          <Icon>logout</Icon>Sign out
        </Button>
      </ConfirmationModal>
      {!isMobile && (
        <Link href="/" style={{ cursor: "default" }} ref={closeRef}>
          <Button sx={styles(false)}>
            <Icon>close</Icon>Close
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        top: 0,
        width: "100vw",
        left: 0,
        zIndex: 999,
        background: `linear-gradient(90deg, ${palette[2]} 0%, ${palette[1]} 25%)`,
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            flex: { xs: "100%", md: "0 0 250px" },
            p: 2,
            background: palette[2],
            minHeight: "100vh",
            height: "100vh",
            overflowY: "scroll",
            "& .container": {
              display: "flex",
              flexDirection: "column",
              height: "100%",
            },
          }}
        >
          <motion.div
            initial={{
              x: -100,
              opacity: 0,
            }}
            key="settingsContainer"
            className="container"
            animate={{
              x: 0,
              opacity: 1,
            }}
          >
            {sidebar}
          </motion.div>
        </Box>
      )}
      {isMobile && (
        <SwipeableDrawer
          open={open}
          anchor="top"
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: "100vw", md: 300 },
              flex: { xs: "calc(100vw - 50px)", md: "0 0 250px" },
              p: 2,
              background: addHslAlpha(palette[3], 0.6),
              backdropFilter: "blur(10px)",
              borderRadius: "0 0 20px 20px",
              height: "auto",
              overflowY: "scroll",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {sidebar}
          <Puller
            sx={{ position: "sticky", bottom: 0, top: "unset", mb: -3 }}
          />
        </SwipeableDrawer>
      )}
      <Box
        sx={{
          maxHeight: "100vh",
          minHeight: "100vh",
          height: "100vh",
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
          {router.asPath !== "/settings" &&
            (isMobile ? (
              <AppBar sx={{ pr: 5, background: "transparent", border: 0 }}>
                <Toolbar>
                  <IconButton onClick={() => router.push("/users")}>
                    <Icon>arrow_back_ios_new</Icon>
                  </IconButton>
                  <Button
                    onClick={() => setOpen(true)}
                    sx={{
                      color: "inherit",
                    }}
                    size="small"
                  >
                    {capitalizeFirstLetter(
                      router.asPath
                        .replace("/settings/", "")
                        .replaceAll("-", " ")
                        .replace("/", "") || "Settings"
                    )}
                    <Icon sx={{ fontSize: "20px!important" }}>expand_more</Icon>
                  </Button>
                </Toolbar>
              </AppBar>
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {capitalizeFirstLetter(
                  router.asPath
                    .replace("/settings/", "")
                    .replaceAll("-", " ") || "Settings"
                )}
              </Typography>
            ))}
          <Box sx={{ p: { xs: 3, sm: 0 }, height: "100%" }}>{children}</Box>
        </motion.div>
      </Box>
    </Box>
  );
}
