import { openSpotlight } from "@/components/Layout/Navigation/Search";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  InputAdornment,
  SwipeableDrawer,
  TextField,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { cloneElement, useEffect, useRef, useState } from "react";
import { Puller } from "../../Puller";
import { CreateTask } from "../Task/Create";

export function SearchTasks({ children }: { children?: JSX.Element }) {
  const ref: any = useRef();
  const router = useRouter();
  const { session } = useSession();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  useEffect(() => {
    if (
      router.asPath.includes("/search") &&
      decodeURIComponent(router.asPath.split("/search/")[1]) !== "[query]"
    ) {
      setQuery(decodeURIComponent(router.asPath.split("/search/")[1]));
    }
  }, [router.asPath]);

  const trigger = cloneElement(
    children || (
      <IconButton sx={{ ml: "auto", color: addHslAlpha(palette[9], 0.7) }}>
        <Icon>search</Icon>
      </IconButton>
    ),
    {
      onClick: (e) => {
        e.stopPropagation();
        setMobileOpen(true);
        setTimeout(() => ref?.current?.focus(), 100);
      },
    }
  );

  const input = (
    <TextField
      inputRef={ref}
      size="small"
      autoFocus={isMobile}
      variant="outlined"
      placeholder="Search tasks..."
      {...(query.trim() && { label: "Search tasks..." })}
      onKeyDown={(e: any) => e.code === "Enter" && e.target.blur()}
      onBlur={() => {
        if (query.trim() !== "") {
          router.push(`/tasks/search/${encodeURIComponent(query)}`);
          setLoading(true);
        }
      }}
      value={query}
      sx={{
        transition: "all .2s",
        zIndex: 999,
        cursor: "default",
        ...(Boolean(query.trim()) && {
          mr: -6,
        }),
      }}
      onChange={(e) => setQuery(e.target.value)}
      InputProps={{
        autoFocus: isMobile,
        sx: {
          cursor: "default",
          borderRadius: 4,
        },
        endAdornment: (
          <InputAdornment position="end">
            {query.trim() && (
              <IconButton size="small">
                {loading ? <CircularProgress /> : <Icon>east</Icon>}
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );

  const CreateTaskWrapper = ({ children }) => (
    <CreateTask
      closeOnCreate
      defaultDate={dayjs().startOf("day").toDate()}
      onSuccess={() => {
        document.getElementById("taskMutationTrigger")?.click();
      }}
    >
      {children}
    </CreateTask>
  );

  return isMobile ? (
    <>
      <SwipeableDrawer
        anchor="top"
        open={mobileOpen}
        onClick={(e) => e.stopPropagation()}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { borderRadius: "0 0 20px 20px" } }}
      >
        <Box sx={{ p: 2, pt: 3 }}>
          <Button
            onClick={() => {
              openSpotlight();
              vibrate(50);
              setMobileOpen(false);
            }}
            size="small"
            sx={{ mb: 2 }}
            variant="contained"
          >
            <Icon>arrow_back_ios_new</Icon>Search
          </Button>
          {input}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflowX: "auto",
            opacity: 0.3,
          }}
        >
          <Chip sx={{ ml: 2 }} icon={<Icon>push_pin</Icon>} label="Important" />
          <Chip icon={<Icon>priority_high</Icon>} label="Completed" />
          <Chip icon={<Icon>palette</Icon>} label="Has color?" />
          <Chip icon={<Icon>image</Icon>} label="Has attachment?" />
        </Box>
        <Puller sx={{ mb: 0 }} />
      </SwipeableDrawer>
      {trigger}
    </>
  ) : (
    <Box
      sx={{
        display: "flex",
        mb: 2,
        gap: 1,
        alignItems: "center",
      }}
    >
      {input}

      {session.permission !== "read-only" && (
        <Tooltip
          placement="right"
          title={
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              New task
              <span
                style={{
                  background: `hsla(240,11%,${isDark ? 90 : 10}%, .1)`,
                  padding: "0 10px",
                  borderRadius: "5px",
                }}
              >
                /
              </span>
            </Box>
          }
        >
          <CreateTaskWrapper>
            <IconButton
              id="createTaskTrigger"
              onClick={(e) => e.stopPropagation()}
              sx={{
                ...(Boolean(query.trim()) && {
                  transform: "scale(0)",
                }),
                cursor: "default",
                transition: "transform .2s",
                background: palette[4],
                color: palette[12],
                "&:hover": {
                  background: palette[5],
                },
                "&:active": {
                  background: palette[6],
                },
              }}
            >
              <Icon>add</Icon>
            </IconButton>
          </CreateTaskWrapper>
        </Tooltip>
      )}
    </Box>
  );
}
