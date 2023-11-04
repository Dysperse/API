"use client";
import { containerRef } from "@/app/(app)/container";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { handleBack } from "@/lib/client/handleBack";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function Layout({ children }: any) {
  const router = useRouter();
  const closeRef: any = useRef();
  const pathname = usePathname();

  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

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
          onClick={() =>
            containerRef.current.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <Toolbar>
            <IconButton
              onClick={() => handleBack(router)}
              sx={{ background: palette[3] }}
            >
              <Icon sx={{ color: palette[9] }}>
                {pathname === "/settings" ? "close" : "arrow_back_ios_new"}
              </Icon>
            </IconButton>
            {pathname !== "/settings" && (
              <Typography sx={{ ml: 2 }}>
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
              pathname
                ?.replace("/settings", "")
                ?.replaceAll("-", " ")
                ?.replaceAll("/", "") || "Settings"
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
              {children}
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
