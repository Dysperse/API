"use client";

import { swipeablePageStyles } from "@/app/(app)/swipeablePageStyles";
import { Navbar } from "@/components/Layout/Navigation/Navbar";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Avatar, Box, Icon, Typography, useMediaQuery } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
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
      <Navbar
        showLogo={pathname === "/rooms"}
        showRightContent={pathname === "/rooms"}
      />
      <Box
        ref={emblaRef}
        sx={{
          maxWidth: "100dvw",
          // overflowX: "hidden",
          ...(loadingIndex !== 1 && {
            pointerEvents: "none",
          }),
        }}
      >
        <Box sx={{ display: { xs: "flex", sm: "block" } }}>
          {pathname === "/rooms" && isMobile && (
            <Box
              sx={{
                flex: "0 0 100dvw",
                position: "sticky",
                top: 0,
                left: 0,
                height: "100dvh",
              }}
            >
              <Box
                sx={{
                  transform: `scale(${loadingIndex === 0 ? 1.5 : 1})`,
                  transition: "all .4s cubic-bezier(.17,.67,.57,1.39)",
                }}
              >
                <Box sx={swipeablePageStyles(palette, "left")}>
                  <Icon className={loadingIndex === 0 ? "filled" : undefined}>
                    upcoming
                  </Icon>
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
              display: "flex",
              maxWidth: "100dvw",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100dvh - var(--navbar-height))",
              background: { sm: palette[2] },
              p: 3,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Avatar sx={{ width: 60, mb: 2, height: 60, borderRadius: 5 }}>
                <Icon>inventory_2</Icon>
              </Avatar>
              <Typography variant="h3" className="font-heading">
                Inventory
              </Typography>
              <Typography variant="h6">
                Soon, you&apos;ll be able to create handy, shareable lists of
                what you have.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
