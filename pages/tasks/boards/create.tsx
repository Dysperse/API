import { CreateBoard } from "@/components/Tasks/Board/Create";
import { TasksLayout } from "@/components/Tasks/Layout";
import { useRef } from "react";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const parentRef = useRef();

  // TODO: Update mutation url
  return (
    <TasksLayout contentRef={parentRef}>
      <CreateBoard parentRef={parentRef.current} />
    </TasksLayout>
  );
}
