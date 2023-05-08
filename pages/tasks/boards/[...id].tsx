import { useRouter } from "next/router";
import { Board } from "../../../components/Boards/Board";
import { TasksLayout } from "../../../components/Boards/Layout";
import { useApi } from "../../../lib/client/useApi";

function BoardContainer({ id }) {
  const { data, url, error } = useApi("property/boards", { id });

  return (
    <>
      {data && (
        <Board mutationUrl={url} board={data[0]} setDrawerOpen={() => {}} />
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

  return <TasksLayout>{id && <BoardContainer id={id} />}</TasksLayout>;
}
