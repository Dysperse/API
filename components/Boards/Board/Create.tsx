import Masonry from "@mui/lab/Masonry";
import { useState } from "react";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../hooks/useApi";
import { OptionsGroup } from "./OptionsGroup";

import {
  Box,
  Button,
  Card,
  Dialog,
  Icon,
  Skeleton,
  Typography,
} from "@mui/material";
import { useStatusBar } from "../../../hooks/useStatusBar";

function Template({ template, mutationUrl, loading, setLoading }: any) {
  const [open, setOpen] = useState(false);
  useStatusBar(open);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
            maxWidth: "100vw",
            width: "100%",
          },
        }}
      >
        <Card
          sx={{
            ...(loading && {
              opacity: 0.5,
              pointerEvents: "none",
            }),
            width: "100%!important",
            background: global.user.darkMode
              ? "hsl(240, 11%, 13%)"
              : "rgba(200,200,200,.3)",
            transition: "transform 0.2s",
            userSelect: "none",
          }}
        >
          <Box>
            <Box
              sx={{
                background: global.user.darkMode
                  ? "hsl(240, 11%, 17%)"
                  : "rgba(200,200,200,.2)",
                color: global.user.darkMode ? "#fff" : "#000",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                overflowX: "auto",
                display: "flex",
              }}
            >
              {template.columns.map((column, index) => (
                <Box
                  key={index.toString()}
                  sx={{
                    width: "100%",
                    display: "inline-flex",
                    minWidth: "200px",
                    overflowX: "auto",
                    p: { xs: 1.5, sm: 2.5 },
                    gap: 2,
                    borderRight:
                      index !== template.columns.length - 1
                        ? "1px solid rgba(0,0,0,.1)"
                        : "none",
                    flexDirection: "column",
                  }}
                >
                  <picture>
                    <img
                      src={column.emoji}
                      width="30px"
                      height="30px"
                      alt="emoji"
                    />
                  </picture>
                  <Box
                    sx={{
                      fontSize: 18,
                      fontWeight: 600,
                      mt: -0.7,
                      maxWidth: "100%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.name}
                  </Box>
                  <Box sx={{ mt: -1 }}>
                    <Skeleton animation={false} height={15} width={100} />
                    <Skeleton animation={false} height={15} width={90} />
                    <Skeleton animation={false} height={15} width={50} />
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 3, pt: 0 }}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {template.name}
              </Typography>
              <Typography variant="body2">{template.description}</Typography>
            </Box>
          </Box>
        </Card>
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            disabled={loading || global.permission == "read-only"}
            size="large"
            sx={{ borderRadius: 99, mx: "auto" }}
            onClick={() => {
              setLoading(true);
              fetchApiWithoutHook("property/boards/createBoard", {
                board: JSON.stringify(template),
              }).then(async () => {
                setOpen(false);
                await mutate(mutationUrl);
                setLoading(false);
              });
            }}
          >
            <Icon className="outlined">edit</Icon>
            {global.permission == "read-only"
              ? "You do not have permission to create a board"
              : "Create new board"}
          </Button>
        </Box>
      </Dialog>
      <Box
        onClick={() => {
          setOpen(true);
        }}
        sx={{
          py: 1,
          px: { sm: 1 },
          maxWidth: "calc(100vw - 52.5px)",
        }}
      >
        <Card
          sx={{
            ...(loading && {
              opacity: 0.5,
              pointerEvents: "none",
            }),
            width: "100%!important",
            background: global.user.darkMode
              ? "hsl(240, 11%, 13%)"
              : "rgba(200,200,200,.3)",
            borderRadius: 5,
            transition: "transform 0.2s",
            cursor: "pointer",
            userSelect: "none",
            "&:hover": {
              background: global.user.darkMode
                ? "hsl(240, 11%, 16%)"
                : "rgba(200,200,200,.4)",
            },
            "&:active": {
              background: global.user.darkMode
                ? "hsl(240, 11%, 17%)"
                : "rgba(200,200,200,.5)",
              transform: "scale(.98)",
              transition: "none",
            },
          }}
        >
          <Box>
            <Box
              sx={{
                background: global.user.darkMode
                  ? "hsl(240, 11%, 17%)"
                  : "rgba(200,200,200,.2)",
                color: global.user.darkMode ? "#fff" : "#000",
                borderRadius: 5,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                display: "flex",
              }}
            >
              {template.columns.map((column, index) => (
                <Box
                  key={index.toString()}
                  sx={{
                    width: "100%",
                    display: "flex",
                    overflowX: "auto",
                    p: { xs: 1.5, sm: 2.5 },
                    gap: 2,
                    borderRight:
                      index !== template.columns.length - 1
                        ? "1px solid rgba(0,0,0,.1)"
                        : "none",
                    flexDirection: "column",
                  }}
                >
                  <picture>
                    <img
                      src={column.emoji}
                      width="30px"
                      height="30px"
                      alt="emoji"
                    />
                  </picture>
                  <Box
                    sx={{
                      fontSize: 18,
                      fontWeight: 600,
                      mt: -0.7,
                      maxWidth: "100%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.name}
                  </Box>
                  <Box sx={{ mt: -1 }}>
                    <Skeleton animation={false} height={15} width={100} />
                    <Skeleton animation={false} height={15} width={90} />
                    <Skeleton animation={false} height={15} width={50} />
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 3, pt: 0 }}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {template.name}
              </Typography>
              <Typography variant="body2">{template.description}</Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  );
}

export function CreateBoard({ length, setDrawerOpen, mutationUrl }: any) {
  const [currentOption, setOption] = useState("Board");
  const templates = [
    {
      name: "School planner",
      description: "NEW: School planner to help organize your assignments",
      color: "blue",
      columns: [
        {
          name: "Math",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4d0.png",
        },
        {
          name: "English",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4d5.png",
        },
        {
          name: "Science",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f9ea.png",
        },
        {
          name: "History",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f30d.png",
        },
      ],
    },
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
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4ab.png",
        },
        {
          name: "Done",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/270c-fe0f.png",
        },
      ],
    },
    {
      name: "Tests, homework, and projects",
      description: "NEW: School planner to help organize your assignments",
      color: "blue",
      columns: [
        {
          name: "Tests",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4af.png",
        },
        {
          name: "Homework",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4dd.png",
        },
        {
          name: "Projects",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2728.png",
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
  const checklists = [
    "Shopping list",
    "Simple checklist",
    "To-do list",
    "Wishlist",
    "Bucket list",
    "Life goals",
    "Party supplies",
    "Ideas",
  ].map((item) => {
    return {
      name: item,
      description: "",
      color: "lime",
      columns: [
        {
          name: "",
          emoji:
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4dd.png",
        },
      ],
    };
  });

  const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ px: {xs:2,sm:5} }}>
      <Box
        sx={{
          // maxWidth: "500px",
          background: "url(/images/board-header.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 5,
          mt: 3,
          p: 4,
          mb: 7,
          mx:{sm: 1},
          py: 5,
        }}
      >
        <Typography
          variant="h5"
          onClick={() => length !== 0 && setDrawerOpen(true)}
          sx={{
            fontWeight: 600,
            lineHeight: 1.5,
            letterSpacing: 0.15,
            borderRadius: 2,
            overflow: "hidden",
            maxWidth: "100%",
            px: 1,
            mb: 2,
            ml: -1,
            color: global.user.darkMode ? "hsl(240,11%,90%)" : "#404040",
            cursor: "auto!important",
            userSelect: "none",
            "&:hover": {
              color: global.user.darkMode ? "hsl(240,11%,80%)" : "#303030",
              background: global.user.darkMode
                ? "hsl(240,11%,13%)"
                : "rgba(200,200,200,.3)",
            },
            "&:active": {
              color: global.user.darkMode ? "hsl(240,11%,95%)" : "#000",
              background: global.user.darkMode
                ? "hsl(240,11%,16%)"
                : "rgba(200,200,200,.4)",
            },

            display: { xs: "inline-flex", md: "inline-flex" },
            alignItems: "center",
            gap: "10px",
          }}
        >
          Create a board {length !== 0 && <Icon>expand_more</Icon>}
        </Typography>
        <Typography
          sx={{ mb: 2, background: "rgba(0,0,0,0.1)", color: "#fff" }}
        >
          Boards are sweet places where you can keep track of almost anything,
          from tasks, to shopping lists, to even product planning.
        </Typography>
        <OptionsGroup
          options={["Board", "Checklist"]}
          currentOption={currentOption}
          setOption={setOption}
        />
      </Box>
      {currentOption === "Checklist" ? (
        <>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={0} sx={{ mt: 2 }}>
            {checklists.map((template) => (
              <Box
                key={template.name}
                onClick={() => {
                  setLoading(true);
                  fetchApiWithoutHook("property/boards/createBoard", {
                    board: JSON.stringify(template),
                  }).then(async () => {
                    await mutate(mutationUrl);
                    setLoading(false);
                  });
                }}
                sx={{
                  py: 1,
                  px: { sm: 1 },
                  maxWidth: "calc(100vw - 52.5px)",
                }}
              >
                <Card
                  sx={{
                    ...(global.permission == "read-only" && {
                      pointerEvents: "none",
                      opacity: 0.5,
                    }),
                    ...(loading && {
                      opacity: 0.5,
                      pointerEvents: "none",
                    }),
                    width: "100%!important",
                    background: global.user.darkMode
                      ? "hsl(240, 11%, 13%)"
                      : "rgba(200,200,200,.3)",
                    borderRadius: 5,
                    p: 3,
                    transition: "transform 0.2s",
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": {
                      background: global.user.darkMode
                        ? "hsl(240, 11%, 16%)"
                        : "rgba(200,200,200,.4)",
                    },
                    "&:active": {
                      background: global.user.darkMode
                        ? "hsl(240, 11%, 18%)"
                        : "rgba(200,200,200,.5)",
                      transform: "scale(.98)",
                      transition: "none",
                    },
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Icon>task_alt</Icon>
                  {template.name}
                </Card>
              </Box>
            ))}
          </Masonry>
        </>
      ) : (
        <Masonry columns={{ xs: 1, sm: 2 }} spacing={0} sx={{ mt: 2 }}>
          {templates.map((template) => (
            <Template
              key={template.name}
              template={template}
              mutationUrl={mutationUrl}
              loading={loading}
              setLoading={setLoading}
            />
          ))}
        </Masonry>
      )}
    </Box>
  );
}
