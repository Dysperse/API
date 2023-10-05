import { TasksLayout } from "@/components/Tasks/Layout";
import { Agenda } from "@/components/tasks/perspectives";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const router = useRouter();
  const [view, start] = router?.query?.view || [];

  const isToday =
    router.asPath ===
      `/tasks/perspectives/${view}/${dayjs().format("YYYY-MM-DD")}` ||
    router.asPath === `/tasks/perspectives/${view}`;

  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    <TasksLayout
      navbarRightContent={
        !isToday ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <IconButton
              onClick={() =>
                router.push(
                  `/tasks/perspectives/${view}/${dayjs().format("YYYY-MM-DD")}`
                )
              }
              sx={{
                color: palette[8],
                fontSize: "15px",
                background: "transparent!important",
                "&:active": {
                  opacity: 0.6,
                },
              }}
            >
              Today
            </IconButton>
          </motion.div>
        ) : (
          <></>
        )
      }
    >
      {view && <Agenda type={view as any} date={start as any} />}
    </TasksLayout>
  );
}
