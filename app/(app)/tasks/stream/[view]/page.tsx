"use client";
import { containerRef } from "@/app/(app)/container";
import { Task } from "@/app/(app)/tasks/Task";
import { ErrorHandler } from "@/components/Error";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
import { TaskNavbar } from "../../navbar";

export default function Page() {
  const params = useParams();
  const { view } = params as any;

  const isMobile = useMediaQuery("(max-width: 600px)");

  //   IDFK WHY THIS HAPPENS!?
  const key = useMemo(() => {
    if (view) {
      return ["space/tasks/stream", { view, time: new Date().toISOString() }];
    }
    return null;
  }, [view]);

  const { data, mutate, error } = useSWR(key);

  return (
    <Box
      sx={{
        maxWidth: "500px",
        px: { sm: 2 },
        mx: "auto",
        mt: { xs: 15, sm: 10 },
      }}
    >
      <TaskNavbar title={capitalizeFirstLetter(view)} />
      <Box sx={{ px: { xs: 3, sm: 0 } }}>
        <Typography variant="h2" className="font-heading">
          {view}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.6 }}>
          {data?.length || 0} items
        </Typography>
      </Box>
      {error && <ErrorHandler callback={mutate} />}
      {data ? (
        <Virtuoso
          useWindowScroll
          customScrollParent={
            isMobile
              ? containerRef.current
              : document.getElementById("boardContainer")
          }
          data={data}
          itemContent={(_, task) => (
            <Task
              isDateDependent={true}
              key={task.id}
              isScrolling={false}
              board={task.board || false}
              columnId={task.column ? task.column.id : -1}
              mutate={() => {}}
              mutateList={(updatedTask) => {
                if (!updatedTask) return mutate();
                mutate(
                  (oldData: any) =>
                    oldData.map((_task) => {
                      if (_task.id === updatedTask.id) return updatedTask;
                      return _task;
                    }),
                  {
                    revalidate: false,
                  }
                );
              }}
              task={task}
            />
          )}
        />
      ) : (
        <Box sx={{ px: 3, display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
