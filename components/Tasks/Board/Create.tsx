import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { colors } from "@/lib/colors";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Dialog,
  Icon,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import Avatar from "boring-avatars";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDeferredValue, useState } from "react";
import { mutate } from "swr";

const checklistCardStyles = (palette) => ({
  background: palette[2],
  borderRadius: 5,
  p: 3,
  transition: "transform 0.2s",
  cursor: "pointer",
  userSelect: "none",
  "&:hover": {
    background: palette[3],
  },
  "&:active": {
    background: palette[4],
    transform: "scale(.98)",
    transition: "none",
  },
  display: "flex",
  alignItems: "center",
  gap: 2,
});

function Template({ template, mutationUrl, loading, setLoading }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

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
            background: palette[2],
            transition: "transform 0.2s",
            userSelect: "none",
          }}
        >
          <Box>
            <Box
              sx={{
                background: palette[3],
                color: isDark ? "#fff" : "#000",
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
            disabled={loading || session?.permission === "read-only"}
            size="large"
            sx={{ borderRadius: 99, mx: "auto" }}
            onClick={() => {
              setLoading(true);
              fetchRawApi(session, "property/boards/create", {
                board: JSON.stringify(template),
              }).then(async (res) => {
                await mutate(mutationUrl);
                router.push(`/tasks/boards/${res.id}`);
                setLoading(false);
              });
            }}
          >
            <Icon className="outlined">edit</Icon>
            {session?.permission === "read-only"
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
            background: palette[2],
            borderRadius: 5,
            cursor: "pointer",
            userSelect: "none",
            "&:hover": {
              background: palette[3],
            },
            "&:active": {
              background: palette[4],
            },
          }}
        >
          <Box>
            <Box
              sx={{
                background: palette[4],
                color: isDark ? "#fff" : "#000",
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

export const templates = [
  {
    for: ["Student", "College student"],
    category: "Work",
    name: "School planner",
    columns: [
      { name: "Math", emoji: "1f4d0" },
      { name: "English", emoji: "1f4d5" },
      { name: "Science", emoji: "1f9ea" },
      { name: "History", emoji: "1f30d" },
    ],
  },
  {
    for: ["Adult"],
    category: "Work",
    name: "Trip planning",
    columns: [
      { name: "Hotels", emoji: "1f4d0" },
      { name: "English", emoji: "1f4d5" },
      { name: "Science", emoji: "1f9ea" },
      { name: "History", emoji: "1f30d" },
    ],
  },
];

export function CreateBoard({ mutationUrl }: any) {
  const [currentOption, setOption] = useState("Board");
  const session = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

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
          emoji: "1f4dd",
        },
      ],
    };
  });

  const createBlankBoard = () => {
    fetchRawApi(session, "property/boards/create", {
      board: JSON.stringify({
        for: ["Student", "College student"],
        name: "Untitled board",
        description: "",
        color: "blue",
        columns: [],
      }),
    }).then(async (res) => {
      await mutate(mutationUrl);
      router.push(`/tasks/boards/${res.id}`);
      setLoading(false);
    });
  };

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <Box sx={{ p: { xs: 2, sm: 5 }, maxWidth: "100vw" }}>
      <Head>
        <title>Explore &bull; {currentOption}s</title>
      </Head>
      <Box sx={{ textAlign: "center", my: 10 }}>
        <Typography variant="h2" className="font-heading" sx={{ mb: 1 }}>
          Explore
        </Typography>
        <Typography variant="h6">
          Build anything with thousands of templates
        </Typography>
        <Box sx={{ px: 1, mt: 2 }}>
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
            sx={{ maxWidth: "400px" }}
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        {[
          { color: "orange", name: "Work", icon: "work" },
          { color: "purple", name: "School", icon: "history_edu" },
          { color: "red", name: "Personal", icon: "celebration" },
          { color: "green", name: "Checklists", icon: "task_alt" },
        ].map((category) => (
          <CardActionArea
            key={category.name}
            sx={{
              background: palette[2],
              p: 2,
              borderRadius: 5,
            }}
          >
            <Icon
              className="outlined"
              sx={{
                color: colors[category.color]["300"],
                mb: 1,
                fontSize: "30px!important",
              }}
            >
              {category.icon}
            </Icon>
            <Typography variant="h5">{category.name}</Typography>
            <Typography variant="body2">50 templates</Typography>
          </CardActionArea>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {templates.map((template, index) => (
            <Card
              key={index}
              sx={{
                width: "300px",
                flex: "0 0 300px",
                background: palette[2],
                borderRadius: 5,
                height: "100%",
              }}
            >
              <CardActionArea sx={{ height: "100%" }}>
                <Box sx={{ position: "relative" }}>
                  <Box sx={{ maxHeight: "300px", overflow: "hidden" }}>
                    <Avatar
                      size="400px"
                      square
                      name={template.name}
                      variant="marble"
                      colors={[
                        "#0A0310",
                        "#49007E",
                        "#FF005B",
                        "#FF7D10",
                        "#FFB238",
                      ]}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      borderRadius: 5,
                      background: palette[2],
                      width: "calc(100% - 20px)",
                      height: "calc(100% - 20px)",

                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1,
                    }}
                  >
                    {template.columns.map((column, index) => (
                      <Box key={index} sx={{}}>
                        <picture>
                          <img
                            src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                            alt="emoji"
                          />
                          <Typography variant="body2">{column.name}</Typography>
                          <Skeleton width="90%" animation={false} />
                          <Skeleton width="100%" animation={false} />
                          <Skeleton width="70%" animation={false} />
                        </picture>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h3" className="font-heading">
                    {template.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    className="font-body"
                  >
                    {template.columns.length} columns
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
