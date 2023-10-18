"use client";
import { SearchTasks } from "@/components/Tasks/Layout/SearchTasks";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Icon,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { containerRef } from "../container";
import { SelectionContext } from "./selection-context";
import { taskStyles } from "./styles";

interface TaskNavbarProps {
  title?: React.ReactNode | string;
  subTitle?: React.ReactNode | String;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
  closeIcon?: String;
}
export function TaskNavbar({
  closeIcon = "close",
  title,
  subTitle,
  rightContent,
  children,
}: TaskNavbarProps) {
  const { session } = useSession();
  const router = useRouter();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );
  const selection = useContext(SelectionContext);
  const isSelecting = selection.length > 0;

  const isMobile = useMediaQuery("(max-width: 600px)");

  return !isMobile ? null : (
    <>
      <AppBar
        onClick={() =>
          containerRef.current.scrollTo({ top: 0, behavior: "smooth" })
        }
        sx={{
          ...taskStyles(palette).appBar,
          ...(isSelecting && {
            opacity: 0,
            transform: "translateX(-50%) scale(.5)",
            pointerEvents: "none",
          }),
          background: addHslAlpha(palette[3], 0.6),
          maxWidth: { xs: "100dvw", md: "400px" },
          "& .MuiIcon-root": {
            color: palette[9],
          },
        }}
      >
        <Toolbar>
          <IconButton
            onClick={() => router.push("/tasks/home")}
            sx={{
              background: addHslAlpha(palette[4], 0.6),
              "&:active": { background: addHslAlpha(palette[4], 0.9) },
            }}
          >
            <Icon>{closeIcon}</Icon>
          </IconButton>
          <Box
            sx={{
              ml: 1,
              color: palette[9],
              flexGrow: 1,
              "&, & *": {
                overflow: "hidden",
                minWidth: 0,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
          >
            {children && children}
            {title && (
              <Typography sx={{ mb: 0, fontWeight: 900 }}>{title}</Typography>
            )}
            {subTitle && (
              <Typography variant="body2" sx={{ mt: -0.4 }}>
                {subTitle}
              </Typography>
            )}
          </Box>
          {!children && (
            <SearchTasks>
              <IconButton>
                <Icon>search</Icon>
              </IconButton>
            </SearchTasks>
          )}
          {rightContent}
        </Toolbar>
      </AppBar>
    </>
  );
}
