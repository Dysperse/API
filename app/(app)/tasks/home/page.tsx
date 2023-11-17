"use client";

import { swipeablePageStyles } from "@/app/(app)/swipeablePageStyles";
import { SearchTasks } from "@/app/(app)/tasks/Layout/SearchTasks";
import { CreateTask } from "@/app/(app)/tasks/Task/Create";
import { Navbar } from "@/components/Layout/Navigation/Navbar";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuChildren } from "../menu";
import { recentlyAccessed } from "../recently-accessed";

function PlanTrigger() {
  const router = useRouter();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  return (
    <Box
      onClick={() => router.push("/tasks/plan")}
      sx={{
        background: palette[3],
        px: 2,
        py: 1,
        gap: 2,
        mb: 2,
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        "&:active": {
          opacity: 0.7,
        },
      }}
    >
      <Avatar
        sx={{ background: palette[4], color: palette[11], flexShrink: 0 }}
      >
        <Icon className="outlined">emoji_objects</Icon>
      </Avatar>
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            opacity: 0.5,
            fontSize: "13px",
            textTransform: "uppercase",
          }}
        >
          STAY ON TOP
        </Typography>
        <Typography sx={{ fontWeight: 900 }}>Plan your day</Typography>
      </Box>
      <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1.5 }}>
        {!dayjs(session.user.lastPlannedTasks).isToday() && (
          <Box
            sx={{
              transition: "all .2s",
              width: 10,
              height: 10,
              background: palette[8],
              borderRadius: 99,
            }}
          />
        )}
        <Icon>arrow_forward_ios</Icon>
      </Box>
    </Box>
  );
}

function RecentlyAccessed() {
  const router = useRouter();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const [item, setItem] = useState<any>({ loading: true });

  useEffect(() => {
    const data = recentlyAccessed.get();
    setItem(data);
  }, []);

  return item?.path ? (
    <>
      <Box
        onClick={() => router.push(item.path)}
        sx={{
          background: palette[3],
          px: 2,
          py: 1,
          gap: 2,
          mb: 2,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          "&:active": {
            opacity: 0.7,
          },
        }}
      >
        <Avatar
          sx={{ background: palette[5], color: palette[11], flexShrink: 0 }}
        >
          <Icon className="outlined">{item.icon}</Icon>
        </Avatar>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              opacity: 0.5,
              fontSize: "13px",
              textTransform: "uppercase",
            }}
          >
            Jump back in
          </Typography>
          <Typography sx={{ fontWeight: 900 }}>{item.label}</Typography>
        </Box>
        <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
      </Box>
    </>
  ) : item?.loading ? (
    <Skeleton
      animation="wave"
      height={60}
      sx={{ mb: 2 }}
      variant="rectangular"
      width="100%"
    />
  ) : (
    <></>
  );
}

export default function Home() {
  const { session } = useSession();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const isMobile = useMediaQuery("(max-width: 600px)");

  const [editMode, setEditMode] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    active: isMobile,
    skipSnaps: true,
  });

  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("scroll", (e) => {
        if (e.selectedScrollSnap() == 1) {
          setLoadingIndex(1);
          document.getElementById("link2")?.click();
        } else {
          setLoadingIndex(0);
        }
      });
    }
  }, [emblaApi, router]);

  return (
    <>
      <Navbar
        showLogo={isMobile}
        showRightContent={!editMode}
        right={
          <Button
            sx={{
              ml: "auto",
              mb: -0.4,
              color: palette[9],
              minWidth: 0,
              "&:hover:not(:active)": {
                background: "transparent",
              },
            }}
            size="small"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Done" : "Edit"}
          </Button>
        }
      />
      <Box
        ref={emblaRef}
        style={{
          maxWidth: "100dvw",
          overflowX: "clip",
          ...(loadingIndex !== 0 && {
            pointerEvents: "none",
          }),
        }}
      >
        <Box sx={{ display: { xs: "flex", sm: "block" } }}>
          <Box sx={{ flex: "0 0 100dvw" }}>
            <Box
              sx={{
                p: 3,
                pb: 0,
                mb: -3,
                mt: 5,
              }}
            >
              <Typography variant="h1">Tasks</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  mt: 0.5,
                  alignItems: "center",
                }}
              >
                <SearchTasks>
                  <TextField
                    variant="standard"
                    placeholder="Search..."
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                      sx: {
                        background: palette[3],
                        "&:active": {
                          background: palette[4],
                        },
                        cursor: "pointer",
                        "& *": { pointerEvents: "none" },
                        "& *::placeholder": {
                          color: palette[10] + "!important",
                        },
                        transition: "all .2s",
                        px: 2,
                        py: 0.3,
                        borderRadius: 3,
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon sx={{ color: palette[9] }}>search</Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </SearchTasks>
                {session.permission !== "read-only" && (
                  <CreateTask
                    onSuccess={() => {}}
                    defaultDate={dayjs().startOf("day").toDate()}
                  >
                    <IconButton
                      sx={{
                        color: palette[11],
                        background: palette[3],
                        "&:active": {
                          background: palette[4],
                        },
                      }}
                    >
                      <Icon>add</Icon>
                    </IconButton>
                  </CreateTask>
                )}
              </Box>
              <RecentlyAccessed />
              <PlanTrigger />
            </Box>
            <MenuChildren editMode={editMode} setEditMode={setEditMode} />
          </Box>
          <Box
            sx={{
              flex: "0 0 100dvw",
              position: "sticky",
              top: 0,
              height: "100dvh",
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                transform: `scale(${loadingIndex === 1 ? 1.5 : 1})`,
                transition: "all .4s cubic-bezier(.17,.67,.57,1.39)",
              }}
            >
              <Box sx={swipeablePageStyles(palette, "right")}>
                <Icon className={loadingIndex === 1 ? "filled" : undefined}>
                  upcoming
                </Icon>
                <Typography variant="h4" className="font-heading">
                  Home
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
