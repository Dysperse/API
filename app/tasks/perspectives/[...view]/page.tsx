"use client";
import { Agenda } from "@/app/tasks/perspectives/perspectives";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import dayjs from "dayjs";
import { useParams, usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const params = useParams();
  const [view, start] = params?.view as any;
  
  const isToday =
    pathname ===
      `/tasks/perspectives/${view}/${dayjs().format("YYYY-MM-DD")}` ||
    pathname === `/tasks/perspectives/${view}`;

  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    // <TasksLayout
    //   navbarRightContent={
    //     !isToday ? (
    //       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
    //         <IconButton
    //           onClick={() =>
    //             router.push(
    //               `/tasks/perspectives/${view}/${dayjs().format("YYYY-MM-DD")}`
    //             )
    //           }
    //           sx={{
    //             color: palette[8],
    //             fontSize: "15px",
    //             background: "transparent!important",
    //             "&:active": {
    //               opacity: 0.6,
    //             },
    //           }}
    //         >
    //           Today
    //         </IconButton>
    //       </motion.div>
    //     ) : (
    //       <></>
    //     )
    //   }
    // >
    //{
    view && <Agenda type={view as any} date={start as any} />
    // }
    // </TasksLayout>
  );
}
