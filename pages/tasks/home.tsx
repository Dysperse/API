import { Navbar } from "@/components/Navbar";
import { MenuChildren, recentlyAccessed } from "@/components/Tasks/Layout";
import { SearchTasks } from "@/components/Tasks/Layout/SearchTasks";
import { isIos } from "@/components/Tasks/Task";
import { CreateTask } from "@/components/Tasks/Task/Create";
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
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
      sx={{ mb: 2, borderRadius: 5 }}
      variant="rectangular"
      width="100%"
    />
  ) : (
    <></>
  );
}

export default function Home() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const [showSync, setShowSync] = useState(true);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Navbar
        showLogo={isMobile}
        showRightContent={!editMode}
        right={
          <Button
            sx={{
              ml: "auto",
              mr: isIos() ? 1 : 0,
              mb: isIos() ? -0.4 : 0,
              color: palette[8],
              minWidth: 0,
            }}
            size="small"
            onClick={() => setEditMode(!editMode)}
            variant={isIos() ? "text" : editMode ? "contained" : "text"}
          >
            {isIos() ? (
              editMode ? (
                "Cancel"
              ) : (
                "Edit"
              )
            ) : (
              <Icon className="outlined">{editMode ? "check" : "edit"}</Icon>
            )}
          </Button>
        }
        hideSettings
        hideSearch
      />
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
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
              fontSize: {
                xs: "65px",
                sm: "80px",
              },
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
      </motion.div>
    </>
  );
}
