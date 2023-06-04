import { ErrorHandler } from "@/components/Error";
import { Board } from "@/components/Tasks/Board";
import { TasksLayout } from "@/components/Tasks/Layout";
import { useApi } from "@/lib/client/useApi";
import { useRouter } from "next/router";
import { useState } from "react";

const BoardContainer = ({ setOpen, id }) => {
  const { data, url, error } = useApi("property/boards", { id });

  return (
    <>
      {error && (
        <ErrorHandler error="An error occured while trying to get this board's information" />
      )}
      {data && (
        <Board
          mutationUrl={url}
          board={data[0]}
          setDrawerOpen={() => setOpen(true)}
        />
      )}
    </>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const id = router?.query?.id?.[0];
  const [open, setOpen] = useState(false);

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      {id && <BoardContainer setOpen={setOpen} id={id} />}
    </TasksLayout>
  );
};

export default Dashboard;
