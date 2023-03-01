import Masonry from "@mui/lab/Masonry";
import { useState } from "react";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../hooks/useApi";
import { OptionsGroup } from "../../OptionsGroup";

import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  Icon,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
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
              : "rgba(200,200,200,.2)",
            transition: "transform 0.2s",
            userSelect: "none",
          }}
        >
          <Box>
            <Box
              sx={{
                background: global.user.darkMode
                  ? "hsl(240, 11%, 17%)"
                  : "rgba(200,200,200,.1)",
                color: global.user.darkMode ? "#fff" : "#000",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                overflowX: "auto",
              }}
            >
              {template.columns.map((column, index) => (
                <Box
                  key={column.id}
                  sx={{
                    width: "100%",
                    display: "flex",
                    minWidth: "200px",
                    overflowX: "auto",
                    p: { xs: 1.5, sm: 2.5 },
                    gap: 2,
                    borderBottom:
                      index !== template.columns.length - 1
                        ? "1px solid rgba(200,200,200,.3)"
                        : "none",
                    alignItems: "center",
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
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 600,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.name}
                  </Typography>
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
            disabled={loading || global.permission === "read-only"}
            size="large"
            sx={{ borderRadius: 99, mx: "auto" }}
            onClick={() => {
              setLoading(true);
              fetchApiWithoutHook("property/boards/create", {
                board: JSON.stringify(template),
              }).then(async () => {
                setOpen(false);
                await mutate(mutationUrl);
                setLoading(false);
              });
            }}
          >
            <Icon className="outlined">edit</Icon>
            {global.permission === "read-only"
              ? "You do not have permission to create a board"
              : "Create new board"}
          </Button>
        </Box>
      </Dialog>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          width: "100%",
          px: { sm: 1 },
        }}
      >
        <Card
          sx={{
            ...(loading && {
              opacity: 0.5,
              pointerEvents: "none",
            }),
            mb: 2,
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
                  key={column.id}
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
  const [searchQuery, setSearchQuery] = useState("");
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
    <Box sx={{ px: { xs: 2, sm: 5 }, maxWidth: "100vw" }}>
      <Box
        sx={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 5,
          mt: 3,
          p: 4,
          mb: 7,
          mx: { sm: 1 },
          overflow: "hidden",
          py: 5,
          position: "relative",
        }}
      >
        <Image
          src="/images/board-header.png"
          alt="Banner"
          placeholder="blur"
          blurDataURL="data:image/png;base64,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"
          width={1500}
          height={500}
          style={{
            filter: "brightness(60%)",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            zIndex: 0,
            top: 0,
            left: 0,
          }}
        />
        <Box sx={{ zIndex: 9, position: "sticky" }}>
          <Typography
            variant="h5"
            onClick={() => length !== 0 && setDrawerOpen(true)}
            sx={{
              zIndex: 9,
              lineHeight: 1.5,
              letterSpacing: 0.15,
              borderRadius: 2,
              overflow: "hidden",
              maxWidth: "100%",
              px: 1,
              mb: 2,
              ml: -1,
              color: "hsl(240,11%,90%)!important",
              cursor: "unset!important",
              userSelect: "none",
              "&:hover": {
                color: "hsl(240,11%,80%)",
                background: "hsl(240,11%,13%)",
              },
              "&:active": {
                color: "hsl(240,11%,95%)",
                background: "hsl(240,11%,16%)",
              },

              display: { xs: "inline-flex", md: "inline-flex" },
              alignItems: "center",
              gap: "10px",
            }}
          >
            Create a board {length !== 0 && <Icon>expand_more</Icon>}
          </Typography>
          <Typography sx={{ mb: 2, color: "#fff", zIndex: 9 }}>
            Boards are sweet places where you can keep track of almost anything,
            from tasks, to shopping lists, to even product planning. You can
            always edit templates after creating.
          </Typography>
          <Box sx={{ zIndex: 9 }}>
            <OptionsGroup
              options={["Board", "Checklist"]}
              currentOption={currentOption}
              setOption={setOption}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ px: 1 }}>
        <TextField
          size="small"
          placeholder='Try searching for "Shopping list"'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon>search</Icon>
              </InputAdornment>
            ),
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      {currentOption === "Checklist" ? (
        <>
          {checklists.filter((checklist) =>
            checklist.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 && (
            <Alert sx={{ mt: 2 }} severity="info">
              No checklists found 😭
            </Alert>
          )}
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={0} sx={{ mt: 2 }}>
            {checklists
              .filter((checklist) =>
                checklist.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((template) => (
                <Box
                  key={template.name}
                  onClick={() => {
                    setLoading(true);
                    fetchApiWithoutHook("property/boards/create", {
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
                      ...(global.permission === "read-only" && {
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
          {templates.filter(
            (template) =>
              template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              template.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          ).length === 0 && (
            <Alert sx={{ mt: 2 }} severity="info">
              No boards found 😭
            </Alert>
          )}
          {templates
            .filter(
              (template) =>
                template.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                template.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
            .map((template) => (
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
