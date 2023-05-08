import { CreateBoard } from "../../../components/Boards/Board/Create";
import { TasksLayout } from "../../../components/Boards/Layout";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  return (
    <TasksLayout>
      <CreateBoard />
    </TasksLayout>
  );
}
