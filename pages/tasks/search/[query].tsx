import { ErrorHandler } from "@/components/Error";
import { TasksLayout, taskStyles } from "@/components/Tasks/Layout";
import { Task } from "@/components/Tasks/Task";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Chip,
  Icon,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";
/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const session = useSession();

  const url = "";

  const { data, error } = useSWR([
    router?.query?.query ? "property/tasks/search" : null,
    { query: router?.query?.query || "" },
  ]);

  const [filters, setFilters] = useState<any>({});

  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null) {
        if (["image", "color"].includes(key)) {
          filtered = filtered.filter((e) => e[key] && e[key] !== "grey");
        } else {
          filtered = filtered.filter((e) => e[key] === filters[key]);
        }
      }
    });
    return filtered;
  }, [data, filters]);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const ref = useRef();

  return (
    <TasksLayout open={open} setOpen={setOpen} contentRef={ref}>
      <Head>
        <title>{filteredData.length} results &bull; Search</title>
      </Head>
      <Box>
        <IconButton
          size="large"
          onClick={() => router.push("/tasks/agenda/days")}
          sx={{
            ...taskStyles(palette).menu,
            right: "20px",
            left: "unset",
            bottom: "20px",
          }}
        >
          <Icon>close</Icon>
        </IconButton>
        <Box
          sx={{
            pb: 1,
            pt: 3,
            gap: 3,
            px: { sm: 3 },
            maxWidth: "100vw",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                overflowX: "scroll",
                px: { xs: 3, sm: 0 },
                mb: 1,
              }}
            >
              <Chip
                variant="outlined"
                icon={<Icon>push_pin</Icon>}
                label="Important"
                onClick={() => setFilters({ ...filters, pinned: true })}
                {...(filters.pinned && {
                  onDelete: () => setFilters({ ...filters, pinned: null }),
                })}
              />
              <Chip
                variant="outlined"
                icon={<Icon>priority</Icon>}
                label="Completed"
                onClick={() => setFilters({ ...filters, completed: true })}
                {...(filters.completed && {
                  onDelete: () => setFilters({ ...filters, completed: null }),
                })}
              />
              <Chip
                variant="outlined"
                icon={<Icon>priority</Icon>}
                label="Incomplete"
                onClick={() => setFilters({ ...filters, completed: false })}
                {...(filters.completed && {
                  onDelete: () => setFilters({ ...filters, completed: null }),
                })}
              />
              <Chip
                variant="outlined"
                icon={<Icon>palette</Icon>}
                label="Color"
                onClick={() => setFilters({ ...filters, color: true })}
                {...(filters.color && {
                  onDelete: () => setFilters({ ...filters, color: null }),
                })}
              />
              <Chip
                variant="outlined"
                icon={<Icon>image</Icon>}
                label="Has attachment"
                onClick={() => setFilters({ ...filters, image: true })}
                {...(filters.image && {
                  onDelete: () => setFilters({ ...filters, image: null }),
                })}
              />
            </Box>
          </Box>
          {error && (
            <ErrorHandler error="Oh no! We couldn't complete your search. Please try again later." />
          )}
          {data && filteredData.length == 0 ? (
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
              {...(!isMobile && { customScrollParent: ref?.current })}
              useWindowScroll
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
