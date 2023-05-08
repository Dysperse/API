import { useState } from "react";
import { ColoredTasks } from "../../components/Boards/ColoredTasks";
import { TasksLayout } from "../../components/Boards/Layout";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <ColoredTasks setDrawerOpen={() => setOpen(true)} />
    </TasksLayout>
  );
}
