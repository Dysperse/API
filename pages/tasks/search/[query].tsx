import { ErrorHandler } from "@/components/Error";
import { TasksLayout, taskStyles } from "@/components/Tasks/Layout";
import { Task } from "@/components/Tasks/Task";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
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

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <Head>
        <title>Search results &bull; Tasks</title>
      </Head>
      <Box
        sx={{
          ...(isMobile && {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            background: palette[1],
          }),
        }}
      >
        <IconButton
          size="large"
          onContextMenu={() => setOpen(true)}
          onClick={() => setOpen(true)}
          sx={{ ...taskStyles(palette).menu, bottom: "20px" }}
        >
          <Icon>menu</Icon>
        </IconButton>
        <IconButton
          size="large"
          onClick={() => router.push("/tasks/agenda/day")}
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
            p: 3,
            pb: 1,
            pt: 5,
            gap: 3,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ px: { sm: 1.5 } }}>
            <Typography
              className="font-heading"
              variant={isMobile ? "h5" : "h4"}
              sx={{ mb: 1 }}
            >
              &ldquo;{router?.query?.query}&rdquo;
            </Typography>
            <Typography sx={{ mb: 2 }} {...(isMobile && { variant: "body2" })}>
              {filteredData.length} results
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, mt: 1, overflowX: "scroll" }}>
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
          <Box
            sx={{
              p: "10px",
              mb: 2,
              flexGrow: 1,
              borderRadius: 5,
              height: "100%",
              position: "relative",
              background: palette[2],
            }}
          >
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
      </Box>
    </TasksLayout>
  );
}
