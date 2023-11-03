"use client";
import { containerRef } from "@/app/(app)/container";
import { ProfilePicture } from "@/app/(app)/users/[id]/ProfilePicture";
import { Logo } from "@/components/Logo";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, IconButton, SxProps, useScrollTrigger } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDeferredValue } from "react";
import { SidebarMenu } from "./Sidebar";

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

  const _isScrollingUp = useScrollTrigger({
    target: containerRef?.current ? containerRef.current : document.body,
  });

  const isScrollingUp = useDeferredValue(_isScrollingUp);

  const isAtTop = useScrollTrigger({
    target: containerRef?.current ? containerRef.current : document.body,
    disableHysteresis: true,
  });

  return (
    <Box
      onClick={() =>
        containerRef.current.scrollTo({ top: 0, behavior: "smooth" })
      }
      sx={{
        display: "flex",
        alignItems: "center",
        p: "15px",
        pt: "40px",
        height: 100,
        "& svg": {
          display: showLogo ? { sm: "none" } : "none",
        },
        maxWidth: "100dvw",
        zIndex: 999,
        position: "sticky",
        top: 0,
        transition: "transform 0.25s, border-bottom .25s",
        transitionTimingFunction: "cubic-bezier(0.1, 0.76, 0.55, 0.9)",
        transform: isScrollingUp ? "translateY(-100px)" : "translateY(-25px)",
        left: 0,
        background: addHslAlpha(palette[1], 0.8),
        backdropFilter: "blur(10px)",
        borderBottom: `2px solid transparent`,
        borderColor: isAtTop
          ? `${addHslAlpha(palette[6], 0.5)}`
          : "transparent",
        ...sx,
        gap: 1.5,
      }}
    >
      <Logo style={{ marginRight: "auto" }} />
      {right}
      <SidebarMenu>
        <IconButton
          sx={{
            p: 0,
          }}
        >
          <ProfilePicture data={session.user} size={36} />
        </IconButton>
      </SidebarMenu>
    </Box>
  );
}
