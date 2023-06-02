import { Task } from "@/components/Boards/Board/Column/Task";
import { TasksLayout } from "@/components/Boards/Layout";
import { ErrorHandler } from "@/components/Error";
import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { Box, Chip, Icon, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const session = useSession();

  const { data, url, error } = useApi("property/tasks/search", {
    query: router?.query?.query,
  });

  const filteredData = useMemo(
    () =>
      data
        ? [
            ...data.filter((e) => !e.completed),
            ...data.filter((e) => e.completed),
          ]
        : [],
    [data]
  );

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <Box
        sx={{
          p: 3,
          pb: 1,
          pt: 5,
          gap: 3,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ px: 1.5, py: { xs: 4, sm: 0 } }}>
          <Typography className="font-heading" variant="h4">
            Showing results for &ldquo;{router?.query?.query}&rdquo;
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
            <Chip
              variant="outlined"
              icon={<Icon>priority</Icon>}
              label="Important"
            />
            <Chip
              variant="outlined"
              icon={<Icon>today</Icon>}
              label="Before..."
            />
            <Chip
              variant="outlined"
              icon={<Icon>today</Icon>}
              label="After..."
            />
            <Chip
              variant="outlined"
              icon={<Icon>palette</Icon>}
              label="Color"
            />
            <Chip
              variant="outlined"
              icon={<Icon>check_circle</Icon>}
              label="Completed"
            />
            <Chip
              variant="outlined"
              icon={<Icon>image</Icon>}
              label="Has attachment"
            />
          </Box>
        </Box>
        <Box
          sx={{
            p: "10px",
            flexGrow: 1,
            borderRadius: 3,
            height: "100%",
            position: "relative",
            background: `hsl(240,11%,${session.user.darkMode ? 15 : 90}%)`,
          }}
        >
          {error && (
            <ErrorHandler error="Oh no! We couldn't complete your search. Please try again later." />
          )}
          {data && data.length == 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <picture>
                <img
                  src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62d.png"
                  alt="Crying emoji"
                />
              </picture>
              <Typography variant="h6">No results found</Typography>
              <Typography>Try broadening your search</Typography>
            </Box>
          ) : (
            <Virtuoso
              style={{ height: "100%", width: "100%" }}
              totalCount={filteredData.length}
              itemContent={(index) => {
                const task = filteredData[index];

                return (
                  <>
                    <Task
                      key={index}
                      isDateDependent={true}
                      board={task.board || false}
                      columnId={task.column ? task.column.id : -1}
                      mutationUrl={url}
                      task={task}
                    />
                  </>
                );
              }}
            />
          )}
        </Box>
      </Box>
    </TasksLayout>
  );
}
