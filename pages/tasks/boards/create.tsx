import { useState } from "react";
import { CreateBoard } from "../../../components/Boards/Board/Create";
import { TasksLayout } from "../../../components/Boards/Layout";
import { useApi } from "../../../lib/client/useApi";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { url } = useApi("property/boards");

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <CreateBoard setDrawerOpen={() => setOpen(true)} mutationUrl={url} />
    </TasksLayout>
  );
}
