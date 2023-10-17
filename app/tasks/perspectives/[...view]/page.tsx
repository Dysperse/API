"use client";
import { Agenda } from "@/app/tasks/perspectives/perspectives";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Button, Collapse } from "@mui/material";
import dayjs from "dayjs";
import { useParams, usePathname, useRouter } from "next/navigation";
import { TaskNavbar } from "../../navbar";

export default function Page() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [view, start] = params?.view as any;
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const isToday =
    pathname ===
      `/tasks/perspectives/${view}/${dayjs().format("YYYY-MM-DD")}` ||
    pathname === `/tasks/perspectives/${view}`;

  const viewHeadingFormats = {
    days: "MMMM",
    weeks: "MMMM",
    months: "YYYY",
  };

  const viewSubHeadingFormats = {
    days: "YYYY",
    weeks: "YYYY",
    months: "-",
  };

  return (
    <>
      <TaskNavbar
        title={dayjs(start).format(viewHeadingFormats[view])}
        subTitle={
          viewSubHeadingFormats[view] == "-"
            ? undefined
            : dayjs(start).format(viewSubHeadingFormats[view])
        }
        rightContent={
          <Collapse in={!isToday} orientation="horizontal">
            <Button
              sx={{ color: palette[9], px: 1 }}
              onClick={() => router.push("/tasks/perspectives/" + view)}
            >
              Today
            </Button>
          </Collapse>
        }
      />
      <Agenda type={view as any} date={start as any} />
    </>
  );
}
