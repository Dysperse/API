"use client";
import { containerRef } from "@/app/container";
import { Logo } from "@/components/Logo";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Icon, IconButton, SxProps } from "@mui/material";
import { useRouter } from "next/navigation";

export function Navbar({
  showLogo = false,
  right,
  showRightContent = false,
  hideSettings = false,
  sx = {},
}: {
  showLogo?: boolean;
  right?: JSX.Element;
  showRightContent?: boolean;
  hideSettings?: boolean;
  sx?: SxProps;
}) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const router = useRouter();

  return (
    <Box
      onClick={() =>
        containerRef.current.scrollTo({ top: 0, behavior: "smooth" })
      }
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        "& svg": {
          display: showLogo ? { sm: "none" } : "none",
        },
        zIndex: 99,
        ...sx,
      }}
    >
      <Logo />
      {right}
      {(!right || showRightContent) && (
        <>
          <IconButton
            onClick={() =>
              router.push(
                `/users/${session.user.username || session.user.email}`
              )
            }
            sx={{
              color: palette[9],
              ml: {
                xs: right ? "" : "auto",
                sm: showRightContent && right ? "" : "auto",
              },
              fontSize: "15px",
              gap: 2,
              borderRadius: 99,
              "& .label": {
                display: { xs: "none", sm: "block" },
              },
            }}
          >
            <Icon className="outlined" sx={{ fontSize: "28px!important" }}>
              account_circle
            </Icon>
            <span className="label">My profile</span>
          </IconButton>
          {!hideSettings && (
            <IconButton
              sx={{ color: palette[9] }}
              onClick={() => router.push("/settings")}
            >
              <Icon className="outlined" sx={{ fontSize: "28px!important" }}>
                &#xe8b8;
              </Icon>
            </IconButton>
          )}
        </>
      )}
    </Box>
  );
}
