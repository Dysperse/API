import {
  Box,
  Button,
  Grow,
  Icon,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { colors } from "../../lib/colors";
import { BottomNav } from "./BottomNavigation";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

const PWAPrompt: any = dynamic(() => import("react-ios-pwa-prompt"), {
  ssr: false,
});

export const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Grow in={props.open} ref={ref} {...props} />;
});

function DailyTaskSection({
  title,
  progress,
  progressIndicator,
}: {
  title: string;
  progress: number;
  progressIndicator: string;
}) {
  return (
    <Box
      sx={{
        my: 1,
        cursor: "pointer",
        "&:hover": {
          background: "#eee",
        },
      }}
    >
      <Box
        sx={{
          px: 4,
          py: 1.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ ml: "auto" }}>
          {progressIndicator}
        </Typography>
      </Box>
      <LinearProgress
        value={progress}
        variant="determinate"
        sx={{ height: 3 }}
      />
    </Box>
  );
}
function DailyTasksModal() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Box
      className="shadow-2xl"
      sx={{
        display: { xs: "none", md: "none" },
        overflow: "hidden",
        bottom: 0,
        right: 0,
        m: 3,
        zIndex: 999,
        width: "100%",
        maxWidth: "350px",
        borderRadius: 3,
        background: "#fff",
        border: "1px solid #ccc",
        color: colors[themeColor][900],
      }}
    >
      <Box
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <Button
          fullWidth
          size="large"
          sx={{
            px: 2,
            py: 1.5,
            ...(expanded && {
              background: "#eee !important",
            }),
          }}
          disableRipple
          color="inherit"
        >
          Today&apos;s tasks
          <Icon sx={{ ml: "auto" }}>
            {!expanded ? "expand_less" : "expand_more"}
          </Icon>
        </Button>
        <LinearProgress
          variant="determinate"
          value={expanded ? 100 : 50}
          sx={{
            opacity: expanded ? 0.2 : 1,
            height: expanded ? 1.5 : 3,
            background: colors[themeColor][100],
            "& .MuiLinearProgress-bar": {
              transition: "none!important",
              background: colors[themeColor][900],
              strokeLinecap: "round",
            },
          }}
        />
      </Box>
      <Box
        sx={{
          display: expanded ? "block" : "none",
          animation: "completedTasks .2s forwards",
        }}
      >
        <DailyTaskSection
          title="Routines"
          progress={75}
          progressIndicator={"4 goals left"}
        />
        <DailyTaskSection
          title="Daily task goal"
          progress={50}
          progressIndicator={"3/5 "}
        />
      </Box>
    </Box>
  );
}

/**
 * Drawer component
 * @param {any} {children} Children
 * @returns {any}
 */
function ResponsiveDrawer({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex" }}>
      {router && (
        <PWAPrompt
          copyBody="Add Carbon to your home screen to have easy access, recieve push notifications, and more!"
          copyTitle="Add Carbon to your home screen!"
        />
      )}
      <Navbar />
      <KeyboardShortcutsModal />
      <DailyTasksModal />
      <Box
        sx={{
          width: { md: "85px" },
          flexShrink: { md: 0 },
        }}
      >
        <Sidebar />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 90,
          p: 0,
          ml: { md: "-85px" },
          // background: "red",
          width: {
            sm: `calc(100% - 65px)`,
            md: `calc(100% - 85px)`,
          },
        }}
      >
        <Toolbar
          sx={{
            height: "calc(70px + env(titlebar-area-height, 0px))",
          }}
        />
        <Box
          sx={{
            height: "70px",
            pt: { xs: 1.8, sm: 0 },
            pl: { md: "85px" },
          }}
        >
          {children}
          {
            !(
              window.location.href.includes("/items") ||
              (window.location.href.includes("/rooms") && <Toolbar />)
            )
          }
        </Box>
        <BottomNav />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
