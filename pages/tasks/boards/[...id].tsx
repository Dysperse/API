import { Board } from "@/components/Boards/Board";
import { TasksLayout } from "@/components/Boards/Layout";
import { useApi } from "@/lib/client/useApi";
import { useRouter } from "next/router";
import { useState } from "react";

function BoardContainer({ setOpen, id }) {
  const { data, url, error } = useApi("property/boards", { id });

  return (
    <>
      {data && (
        <Board
          mutationUrl={url}
          board={data[0]}
          setDrawerOpen={() => setOpen(true)}
        />
      )}
    </>
  );
}

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const router = useRouter();
  const id = router && router.query && router.query.id && router.query.id[0];
  const [open, setOpen] = useState(false);

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      {id && <BoardContainer setOpen={setOpen} id={id} />}
    </TasksLayout>
  );
}
