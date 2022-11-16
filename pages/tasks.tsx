import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ErrorHandler } from "../components/error";
import { useApi } from "../hooks/useApi";
import { colors } from "../lib/colors";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Masonry from "@mui/lab/Masonry";
import { Card, CardActionArea } from "@mui/material";

function Column({ column }) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(200, 200, 200, 0.5)",
        p: 3,
        borderRadius: 5,
      }}
    >
      <img src={column.emoji} />
      <Typography variant="h5" sx={{ fontWeight: "600" }}>
        {column.name}
      </Typography>
      {column.tasks.map((task) => (
        <Typography variant="body1" sx={{ fontWeight: "400" }}>
          {task.name}
        </Typography>
      ))}
    </Box>
  );
}

function Board({ board }: any) {
  const { data, error } = useApi("property/boards/tasks", {
    id: board.id,
  });
  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your tasks" />
      )}
      {data && data.map((column) => <Column column={column} />)}
    </Box>
  );
}

function CreateBoard() {
  const templates = [
    {
      name: "To-do",
      description: "A simple to-do list",
      color: "blue",
      columns: [
        {
          name: "To-do",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png",
        },
        {
          name: "In progress",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c3.png",
        },
        {
          name: "Done",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c1.png",
        },
      ],
    },
    {
      name: "Reading list",
      description: "A list of books to read",
      color: "green",
      columns: [
        {
          name: "To-read",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4da.png",
        },
        {
          name: "In progress",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c3.png",
        },
        {
          name: "Done",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c1.png",
        },
      ],
    },
    {
      name: "Shopping list",
      description: "A list of things to buy",
      color: "red",
      columns: [
        {
          name: "Fruits",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f34e.png",
        },
        {
          name: "Vegetables",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f345.png",
        },
        {
          name: "Meat",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f356.png",
        },
        {
          name: "Other",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4b0.png",
        },
      ],
    },
    {
      name: "Trip planning template",
      description: "A template for planning a trip",
      color: "deepOrange",
      columns: [
        {
          name: "Flights",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2708.png",
        },
        {
          name: "Hotels",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3e8.png",
        },
        {
          name: "Activities",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c8.png",
        },
        {
          name: "Transportation",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f68c.png",
        },
      ],
    },
    {
      name: "Workout",
      description: "A template for planning a workout",
      color: "purple",
      columns: [
        {
          name: "Warm-up",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3cb.png",
        },
        {
          name: "Main workout",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3cb.png",
        },
        {
          name: "Cool-down",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3cb.png",
        },
      ],
    },
    {
      name: "Project planning",
      description: "A template for planning a project",
      color: "orange",
      columns: [
        {
          name: "Ideas",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4a1.png",
        },
        {
          name: "Research",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4d6.png",
        },
        {
          name: "Design",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4bc.png",
        },
        {
          name: "Budget",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4b0.png",
        },
        {
          name: "Development",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4bb.png",
        },
      ],
    },
    {
      name: "Life goals",
      description: "A template for planning your life goals",
      color: "pink",
      columns: [
        {
          name: "Today",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4c5.png",
        },
        {
          name: "This week",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4c5.png",
        },
        {
          name: "This month",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4c5.png",
        },
        {
          name: "This year",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4c5.png",
        },
        {
          name: "Life",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4c5.png",
        },
      ],
    },
    {
      name: "Bucket list",
      description: "A template for planning your bucket list",
      color: "lime",
      columns: [
        {
          name: "Places",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f30d.png",
        },
        {
          name: "Experiences",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3a8.png",
        },
        {
          name: "Things to do",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4dd.png",
        },
      ],
    },
  ];
  return (
    <Masonry columns={{ xs: 1, sm: 4 }} spacing={2} sx={{ mt: 2 }}>
      {templates.map((template) => (
        <Box>
          <Card
            sx={{
              width: "100%!important",
              background: "#eee",
              borderRadius: 5,
            }}
          >
            <CardActionArea
              sx={{
                p: 2,
              }}
            >
              <Box>
                <Box
                  sx={{
                    background: colors[template.color]["A400"],
                    color: template.color === "lime" ? "#000" : "#fff",
                    borderRadius: 5,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {template.columns.map((column, index) => (
                    <Box
                      sx={{
                        width: "100%",
                        alignItems: "center",
                        display: "flex",
                        p: 2,
                        gap: 2,
                        ...(index !== template.columns.length - 1 && {
                          borderBottom:
                            "2px solid " + colors[template.color]["50"],
                        }),
                      }}
                    >
                      <img src={column.emoji} width="30px" height="30px" />
                      <Box sx={{ fontSize: 18 }}>{column.name}</Box>
                    </Box>
                  ))}
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {template.name}
                </Typography>
                <Typography variant="body2">{template.description}</Typography>
              </Box>
            </CardActionArea>
          </Card>
        </Box>
      ))}
    </Masonry>
  );
}

function TasksLayout() {
  const { data, error } = useApi("property/boards");
  const [activeTab, setActiveTab] = useState(data ? data[0].id : "new");
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      containScroll: "keepSnaps",
      dragFree: true,
    },
    [WheelGesturesPlugin()]
  );

  useEffect(() => {
    if (data && !error && data[0]) {
      setActiveTab(data[0].id);
    } else if ((data && !data[0]) || error) {
      setActiveTab("new");
    }
  }, [data]);

  const styles = (condition) => ({
    transition: "none!important",
    px: 3,
    gap: 1.5,
    borderRadius: 4,
    mr: 1,
    fontSize: "15px",
    "&:hover, &:focus": {
      background: "#eee!important",
    },
    ...(condition && {
      background: colors[themeColor][700] + "!important",
      "&:hover, &:focus": {
        background: colors[themeColor][900] + "!important",
      },
      color: colors[themeColor][50] + "!important",
    }),
  });

  return (
    <Box>
      {error && (
        <ErrorHandler error="An error occurred while loading your tasks" />
      )}
      <Box ref={emblaRef}>
        <div className="embla__container">
          {data &&
            data.map((board) => (
              <div>
                <Button
                  size="large"
                  disableElevation
                  onClick={() => setActiveTab(board.id)}
                  sx={styles(activeTab === board.id)}
                >
                  {board.name}
                </Button>
              </div>
            ))}
          <div>
            <Button
              size="large"
              disableElevation
              onClick={() => setActiveTab("new")}
              sx={{
                ...styles(activeTab === "new"),
                px: 2,
                gap: 2,
              }}
            >
              <span className="material-symbols-rounded">add_circle</span>Create
            </Button>
          </div>
        </div>
      </Box>

      <Box>{activeTab === "new" && <CreateBoard />}</Box>
      {data &&
        data.map((board) => activeTab === board.id && <Board board={board} />)}
    </Box>
  );
}

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>
          Tasks &bull;{" "}
          {global.property.profile.name.replace(/./, (c) => c.toUpperCase())}{" "}
          &bull; Carbon
        </title>
      </Head>
      <Container sx={{ mt: 4 }}>
        <TasksLayout />
      </Container>
    </>
  );
}
