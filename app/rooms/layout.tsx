"use client";
import { swipeablePageStyles } from "@/app/swipeablePageStyles";
import { Navbar } from "@/components/Navbar";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { JumpBackIn, Panel } from "./page";

export default function RoomLayout({ children }) {
  const { session } = useSession();
  const router = useRouter();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 1,
    active: router.asPath === "/rooms",
  });
  const [loadingIndex, setLoadingIndex] = useState(1);

  useEffect(() => {
    if (router.asPath === "/rooms" && emblaApi) {
      emblaApi.on("scroll", (e) => {
        if (e.selectedScrollSnap() == 0) {
          setLoadingIndex(0);
          router.push("/");
        } else {
          setLoadingIndex(1);
        }
      });
    }
  }, [emblaApi, router]);

  return (
    <>
      {isMobile && !router.asPath.includes("audit") && (
        <Navbar
          showLogo={router.asPath === "/rooms"}
          showRightContent={router.asPath === "/rooms"}
          right={
            router.asPath == "/rooms" ? undefined : (
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
          ...(loadingIndex !== 1 && {
            pointerEvents: "none",
          }),
        }}
      >
        <Box sx={{ display: { xs: "flex", sm: "block" } }}>
          {router.asPath === "/rooms" && (
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
                {children || (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <JumpBackIn />
                  </Box>
                )}
              </Box>
              {isMobile && router.asPath === "/rooms" && <Panel />}
            </motion.div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
