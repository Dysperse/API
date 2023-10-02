import { Agenda } from "@/components/Tasks/Agenda";
import { TasksLayout } from "@/components/Tasks/Layout";
import { useRouter } from "next/router";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const router = useRouter();
  const [view, start] = router?.query?.view || [];

  return (
    <TasksLayout>
      {view && <Agenda type={view as any} date={start as any} />}
    </TasksLayout>
  );
}
