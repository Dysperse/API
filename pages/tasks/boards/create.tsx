import { CreateBoard } from "@/components/Tasks/Board/Create";
import { TasksLayout } from "@/components/Tasks/Layout";
import { useApi } from "@/lib/client/useApi";
import { useRef, useState } from "react";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { url } = useApi("property/boards");
  const parentRef = useRef();

  return (
    <TasksLayout open={open} setOpen={setOpen} contentRef={parentRef}>
      <CreateBoard mutationUrl={url} parentRef={parentRef.current} />
    </TasksLayout>
  );
}
