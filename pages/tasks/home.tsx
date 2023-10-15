import { Navbar } from "@/components/Navbar";
import { MenuChildren, recentlyAccessed } from "@/components/Tasks/Layout";
import { SearchTasks } from "@/components/Tasks/Layout/SearchTasks";
import { CreateTask } from "@/components/Tasks/Task/Create";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
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
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { swipeablePageStyles } from "..";

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
          background: palette[2],
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
          sx={{ background: palette[3], color: palette[11], flexShrink: 0 }}
        >
          <Icon className="outlined">{item.icon}</Icon>
        </Avatar>
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
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
          router.push("/");
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
              mr: 1,
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
        sx={{
          borderBottom: `2px solid transparent`,
          ...(editMode && {
            position: "sticky",
            top: 0,
            zIndex: 999,
            backdropFilter: "blur(10px)",
            background: addHslAlpha(palette[1], 0.7),
            borderColor: `${palette[2]}`,
          }),
        }}
      />
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        ref={emblaRef}
        style={{
          ...(loadingIndex !== 0 && {
            pointerEvents: "none",
          }),
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: "0 0 100dvw" }}>
            <Box
              sx={{
                p: 3,
                pb: 0,
                mb: -3,
                mt: 5,
              }}
            >
              <Typography
                variant="h2"
                className="font-heading"
                sx={{
                  background: `linear-gradient(180deg, ${palette[11]}, ${palette[10]})`,
                  WebkitBackgroundClip: "text",
                  fontSize: "min(70px, 20vw)",
                }}
              >
                Tasks
              </Typography>
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
                        background: palette[2],
                        "&:focus-within": {
                          background: palette[3],
                        },
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
                        background: palette[2],
                        "&:active": {
                          background: palette[3],
                        },
                      }}
                    >
                      <Icon>add</Icon>
                    </IconButton>
                  </CreateTask>
                )}
              </Box>
              <RecentlyAccessed />
            </Box>
            <MenuChildren editMode={editMode} setEditMode={setEditMode} />
          </Box>
          <Box sx={{ flex: "0 0 100dvw" }}>
            <Box
              sx={{
                transform: `scale(${loadingIndex === 1 ? 1.5 : 1})`,
                transition: "all .4s cubic-bezier(.17,.67,.57,1.39)",
              }}
            >
              <Box sx={swipeablePageStyles(palette, "right")}>
                <Icon>upcoming</Icon>
                <Typography variant="h4" className="font-heading">
                  Home
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </>
  );
}
