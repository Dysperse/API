"use client";
import { swipeablePageStyles } from "@/app/(app)/swipeablePageStyles";
import { Navbar } from "@/components/Layout/Navigation/Navbar";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Icon,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Panel } from "./Panel";

export default function RoomLayout({ children }) {
  const { session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 1,
    active: pathname === "/rooms",
  });
  const [loadingIndex, setLoadingIndex] = useState(1);

  useEffect(() => {
    if (pathname === "/rooms" && emblaApi) {
      emblaApi.on("scroll", (e) => {
        if (e.selectedScrollSnap() == 0) {
          setLoadingIndex(0);
          document.getElementById("link2")?.click();
          // router.push("/");
        } else {
          setLoadingIndex(1);
        }
      });
    }
  }, [emblaApi, router, pathname]);

  return (
    <>
      {isMobile && !pathname?.includes("audit") && (
        <Navbar
          showLogo={pathname === "/rooms"}
          showRightContent={pathname === "/rooms"}
          right={
            pathname == "/rooms" ? undefined : (
              <IconButton
                onClick={() => router.push("/rooms")}
                sx={{ color: palette[8] }}
              >
                <Icon>arrow_back_ios_new</Icon>
              </IconButton>
            )
          }
        />
      )}
      <Box
        ref={emblaRef}
        sx={{
          maxWidth: "100dvw",
          overflowX: "hidden",
          ...(loadingIndex !== 1 && {
            pointerEvents: "none",
          }),
        }}
      >
        <Box sx={{ display: { xs: "flex", sm: "block" } }}>
          {pathname === "/rooms" && isMobile && (
            <Box
              sx={{
                flex: { xs: "0 0 100dvw", sm: "" },
              }}
            >
              <Box
                sx={{
                  transform: `scale(${loadingIndex === 0 ? 1.5 : 1})`,
                  transition: "all .4s cubic-bezier(.17,.67,.57,1.39)",
                }}
              >
                <Box sx={swipeablePageStyles(palette, "left")}>
                  <Icon>upcoming</Icon>
                  <Typography variant="h4" className="font-heading">
                    Home
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          <Box
            sx={{
              flex: { xs: "0 0 100dvw", sm: "" },
              display: { sm: "flex" },
              maxWidth: "100dvw",
              height: { sm: "100dvh" },
              background: { sm: palette[2] },
            }}
          >
            {/* Sidebar */}
            {!isMobile && <Panel />}

            {/* Content */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{ width: "100%" }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { sm: "100dvh" },
                  background: palette[1],
                  borderRadius: { sm: "20px 0 0 20px" },
                  overflowY: "auto",
                }}
              >
                {children}
              </Box>
              {isMobile && pathname === "/rooms" && <Panel />}
            </motion.div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
