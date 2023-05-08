import { Backlog } from "../../components/Boards/Backlog";
import { TasksLayout } from "../../components/Boards/Layout";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  return (
    <TasksLayout>
      <Backlog setDrawerOpen={() => {}} />
    </TasksLayout>
  );
}
