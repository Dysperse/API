import { CreateBoard } from "@/components/Tasks/Board/Create";
import { TasksLayout } from "@/components/Tasks/Layout";
import { useRef, useState } from "react";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const parentRef = useRef();

  // TODO: Update mutation url
  return (
    <TasksLayout open={open} setOpen={setOpen} contentRef={parentRef}>
      <CreateBoard parentRef={parentRef.current} />
    </TasksLayout>
  );
}
