import { containerRef } from "@/components/Layout";
import { TasksLayout } from "@/components/Tasks/Layout";
import { Task } from "@/components/Tasks/Task";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";

export default function Page() {
  const scrollParentRef = useRef();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const query = router?.query?.query
    ? JSON.parse(router.query.query.toString())
    : null;

  const { data, error, mutate } = useSWR([
    "property/tasks/search",
    { query: JSON.stringify(query) },
  ]);

  return (
    <TasksLayout contentRef={scrollParentRef}>
      <Box
        sx={{
          maxWidth: "500px",
          px: { sm: 2 },
          mx: "auto",
          mt: { xs: 15, sm: 10 },
        }}
      >
        <Box sx={{ px: { xs: 3, sm: 0 } }}>
          <Box sx={{ px: { sm: 2 } }}>
            <Typography variant="h2" className="font-heading">
              Search results
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.6 }}>
              {data?.results?.length || 0} items
            </Typography>
          </Box>
          {data ? (
            <Virtuoso
              useWindowScroll
              customScrollParent={
                isMobile ? containerRef.current : scrollParentRef.current
              }
              data={data.results}
              itemContent={(_, task) => (
                <Task
                  isAgenda
                  isDateDependent={true}
                  key={task.id}
                  isScrolling={false}
                  board={task.board || false}
                  columnId={task.column ? task.column.id : -1}
                  mutate={() => {}}
                  mutateList={mutate}
                  task={task}
                />
              )}
            />
          ) : (
            <Box
              sx={{ px: 3, display: "flex", justifyContent: "center", mt: 3 }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </TasksLayout>
  );
}
