import { TasksLayout } from "@/components/Boards/Layout";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      {JSON.stringify(router.query)}
    </TasksLayout>
  );
}
