import { ColoredTasks } from "@/components/Tasks/ColoredTasks";
import { TasksLayout } from "@/components/Tasks/Layout";
import { useState } from "react";

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
