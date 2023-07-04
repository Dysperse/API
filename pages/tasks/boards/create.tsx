import { CreateBoard } from "@/components/Tasks/Board/Create";
import { TasksLayout } from "@/components/Tasks/Layout";
import { useApi } from "@/lib/client/useApi";
import { useState } from "react";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { url } = useApi("property/boards");

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <CreateBoard mutationUrl={url} />
    </TasksLayout>
  );
}
