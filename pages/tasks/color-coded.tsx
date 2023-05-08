import { ColoredTasks } from "../../components/Boards/ColoredTasks";
import { TasksLayout } from "../../components/Boards/Layout";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  return (
    <TasksLayout>
      <ColoredTasks setDrawerOpen={() => {}} />
    </TasksLayout>
  );
}
