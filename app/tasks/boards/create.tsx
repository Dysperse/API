import { CreateBoard } from "@/app/tasks/boards/[id]/Board/Create";
import { useRef } from "react";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const parentRef = useRef();

  // TODO: Update mutation url
  return <CreateBoard parentRef={parentRef.current} />;
}
