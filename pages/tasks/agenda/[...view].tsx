import { useRouter } from "next/router";
import { Agenda } from "../../../components/Boards/Agenda";
import { TasksLayout } from "../../../components/Boards/Layout";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const router = useRouter();
  const view =
    router && router.query && router.query.view && router.query.view[0];

  return (
    <TasksLayout>
      {view && <Agenda setDrawerOpen={() => {}} view={view as any} />}
    </TasksLayout>
  );
}
