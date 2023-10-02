import { Agenda } from "@/components/Tasks/Agenda";
import { TasksLayout } from "@/components/Tasks/Layout";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const router = useRouter();
  const [view, start] = router?.query?.view || [];

  const isToday =
    router.asPath === `/tasks/agenda/${view}/${dayjs().format("YYYY-MM-DD")}` ||
    router.asPath === `/tasks/agenda/${view}`;

  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    <TasksLayout
      navbarRightContent={
        !isToday ? (
          <IconButton
            onClick={() =>
              router.push(
                `/tasks/agenda/${view}/${dayjs().format("YYYY-MM-DD")}`
              )
            }
            sx={{
              color: palette[9],
              fontSize: "15px",
              background: "transparent!important",
              "&:active": {
                opacity: 0.6,
              },
            }}
          >
            Today
          </IconButton>
        ) : (
          <></>
        )
      }
    >
      {view && <Agenda type={view as any} date={start as any} />}
    </TasksLayout>
  );
}
