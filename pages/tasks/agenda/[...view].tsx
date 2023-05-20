import { Agenda } from "@/components/Boards/Agenda";
import { TasksLayout } from "@/components/Boards/Layout";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const router = useRouter();
  const view =
    router && router.query && router.query.view && router.query.view[0];
  const [open, setOpen] = useState(false);

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      {view && (
        <Agenda setDrawerOpen={() => setOpen(true)} view={view as any} />
      )}
    </TasksLayout>
  );
}
