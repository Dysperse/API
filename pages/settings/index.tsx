import { ConfirmationModal } from "@/components/ConfirmationModal";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
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
      router.push("/settings/account");
    }
  }, [router]);

  const [open, setOpen] = useState(false);

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
    "&:hover, &:focus": {
      background: `hsl(240,11%,${session.user.darkMode ? 15 : 95}%)`,
    },
    ...(session.user.darkMode && {
      color: "hsl(240,11%, 80%)",
    }),
    "& span": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      minWidth: 0,
    },
    ...(!condition
      ? {
          color: `hsl(240,11%,${session.user.darkMode ? 80 : 30}%)`,
          "&:hover": {
            background: `hsl(240,11%,${session.user.darkMode ? 20 : 93}%)`,
          },
        }
      : {
          color: `hsl(240,11%,${session.user.darkMode ? 95 : 10}%)`,
          background: `hsl(240,11%,${session.user.darkMode ? 20 : 85}%)`,
          "&:hover, &:focus": {
            background: `hsl(240,11%,${session.user.darkMode ? 20 : 85}%)`,
          },
        }),
  });

  const isMobile = useMediaQuery("(max-width: 900px)");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const openGroupSettings = () => {
    handleClose();
    document.getElementById("activeProperty")?.click();
  };

  const sidebar = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "15px",
          gap: 1,
        }}
      >
        <Menu
          sx={{
            zIndex: 999999999999999999,
          }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleClose} selected>
            My account
          </MenuItem>
          <MenuItem onClick={openGroupSettings}>My group</MenuItem>
        </Menu>
        <Image
          width={50}
          height={50}
          src="/logo.svg"
          alt="logo"
          style={{
            marginTop: "-1px",
            marginLeft: "-1px",
            ...(session.user.darkMode && {
              filter: "invert(100%)",
            }),
          }}
        />
        <Button
          size="small"
          onClick={handleClick}
          sx={{
            "& .e": {
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              textOverflow: "ellipsis",
            },
            color: "inherit",
          }}
        >
          <span className="e">My account</span>
          <Icon>expand_more</Icon>
        </Button>
      </Box>
      {[
        { icon: "account_circle", text: "Account" },
        { icon: "palette", text: "Appearance" },
        { icon: "change_history", text: "Login Activity" },
        { icon: "notifications", text: "Notifications" },
        { icon: "lock", text: "Two-factor authentication" },
      ].map((button) => (
        <Link
          href={`/settings/${button.text.toLowerCase().replaceAll(" ", "-")}`}
          onClick={() => setOpen(false)}
          key={button.icon}
          style={{ display: "block", cursor: "default" }}
        >
          <Button
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
        </Link>
      ))}
      <ConfirmationModal
        title="Sign out"
        question="Are you sure you want to sign out?"
        buttonText="Sign out"
        callback={() =>
          fetchRawApi("auth/logout").then(() => mutate("/api/session"))
        }
      >
        <Button sx={{ ...styles(false), mt: "auto" }}>
          <Icon>logout</Icon>Sign out
        </Button>
      </ConfirmationModal>
      {!isMobile && (
        <Link href="/zen" style={{ cursor: "default" }} ref={closeRef}>
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
        background: `hsl(240,11%,${
          session.user.darkMode ? 5 : isMobile ? 100 : 97
        }%)`,
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            flex: { xs: "100%", md: "0 0 250px" },
            p: 2,
            background: `hsl(240,11%,${session.user.darkMode ? 7 : 94}%)`,
            minHeight: "100vh",
            height: "100vh",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {sidebar}
        </Box>
      )}
      {isMobile && (
        <SwipeableDrawer
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            zIndex: 9999999999,
          }}
          PaperProps={{
            sx: {
              width: { xs: "calc(100vw - 50px)", md: 300 },
              flex: { xs: "calc(100vw - 50px)", md: "0 0 250px" },
              p: 2,
              background: `hsl(240,11%,${session.user.darkMode ? 10 : 94}%)`,
              borderRadius: "0 20px 20px 0",
              minHeight: "100vh",
              height: "100vh",
              overflowY: "scroll",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {sidebar}{" "}
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
        {router.asPath !== "/settings" &&
          (isMobile ? (
            <AppBar>
              <Toolbar>
                <IconButton onClick={() => setOpen(true)}>
                  <Icon>unfold_more</Icon>
                </IconButton>
                <Button
                  size="small"
                  onClick={() => setOpen(true)}
                  sx={{ color: "inherit" }}
                >
                  {capitalizeFirstLetter(
                    router.asPath
                      .replace("/settings/", "")
                      .replaceAll("-", " ") || "Settings"
                  )}
                </Button>
                <IconButton
                  onClick={() => router.push("/zen")}
                  sx={{ ml: "auto" }}
                >
                  <Icon>close</Icon>
                </IconButton>
              </Toolbar>
            </AppBar>
          ) : (
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              {capitalizeFirstLetter(
                router.asPath.replace("/settings/", "").replaceAll("-", " ") ||
                  "Settings"
              )}
            </Typography>
          ))}
        <Box sx={{ p: { xs: 3, sm: 0 }, height: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
}
