"use client";
import { containerRef } from "@/app/(app)/container";
import { ProfilePicture } from "@/app/(app)/users/[id]/ProfilePicture";
import { Logo } from "@/components/Logo";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Badge,
  Box,
  IconButton,
  SxProps,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import { green } from "@radix-ui/colors";
import { useDeferredValue } from "react";
import { SidebarMenu } from "./Sidebar";
import { UpdateButton } from "./UpdateButton";

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
  const isMobile = useMediaQuery("(max-width: 600px)");
  const target = isMobile
    ? undefined
    : containerRef?.current
    ? containerRef.current
    : typeof document === "undefined"
    ? undefined
    : document.body;

  const _isScrollingUp = useScrollTrigger({ target });
  const isScrollingUp = useDeferredValue(_isScrollingUp);
  const isAtTop = useScrollTrigger({ target, disableHysteresis: true });

  return (
    <Box
      onClick={() =>
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" })
      }
      sx={{
        display: "flex",
        alignItems: "center",
        p: 3,
        py: 2,
        height: 75,
        "& svg": {
          display: showLogo ? { sm: "none" } : "none",
        },
        maxWidth: "100dvw",
        zIndex: 999,
        position: "sticky",
        top: 0,
        transition: "transform 0.25s, border-bottom .25s",
        transitionTimingFunction: "cubic-bezier(0.1, 0.76, 0.55, 0.9)",
        transform: isScrollingUp ? "translateY(-100px)" : "translateY(0px)",
        left: 0,
        background: addHslAlpha(palette[1], isAtTop ? 0.8 : 0),
        backdropFilter: `blur(${isAtTop ? 10 : 0}px)`,
        borderBottom: `2px solid transparent`,
        borderColor: isAtTop
          ? `${addHslAlpha(palette[6], 0.5)}`
          : "transparent",
        ...sx,
        gap: 1.5,
      }}
    >
      <Logo style={{ marginRight: "auto", order: -2 }} />
      {right}
      <UpdateButton />
      {isMobile && (
        <SidebarMenu>
          <IconButton
            sx={{
              p: 0,
            }}
          >
            <Badge
              variant="dot"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              sx={{
                "& .MuiBadge-badge": {
                  background: green["green9"],
                  border: (theme) => `3px solid ${theme.palette.primary[1]}`,
                  width: 14,
                  height: 14,
                  mb: 0.6,
                  mr: 0.6,
                },
              }}
            >
              <ProfilePicture data={session.user} size={36} />
            </Badge>
          </IconButton>
        </SidebarMenu>
      )}
    </Box>
  );
}
