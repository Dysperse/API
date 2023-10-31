import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { colors } from "@/lib/colors";
import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Avatar from "boring-avatars";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { cloneElement, useDeferredValue, useState } from "react";
import { toast } from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";

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

function Template({ onboarding, children, template, mutate }: any) {
  const router = useRouter();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const trigger = cloneElement(children, {
    onClick: () => setOpen(true),
  });
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: "calc(100vw - 326px)" },
            borderRadius: 0,
          },
        }}
        slotProps={{
          ...(!onboarding && {
            backdrop: {
              sx: {
                display: "none!important",
              },
            },
          }),
        }}
      >
        <AppBar sx={{ borderBottom: 0 }}>
          <Toolbar>
            <IconButton onClick={() => setOpen(false)}>
              <Icon>close</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 5, pb: 0 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mt: 3,
              mb: { xs: 2, sm: 0 },
              flexWrap: "wrap",
            }}
          >
            {template.category && <Chip label={template.category} />}
            {template.for.map((tag) => (
              <Chip key={tag} label={tag + "s"} />
            ))}
          </Box>
          <Typography variant={isMobile ? "h3" : "h1"} className="font-heading">
            {template.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            By{" "}
            <span style={{ display: "flex", gap: "3px" }}>
              <b>Dysperse</b> <Icon>verified</Icon>
            </span>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 2,
            pl: 5,
            overflowX: "scroll",
          }}
        >
          {template.columns.map((column) => (
            <Box
              key={column.id}
              sx={{
                width: "100%",
                minWidth: "200px",
                overflowX: "auto",
                p: { xs: 1.5, sm: 2.5 },
                gap: 2,
                background: palette[3],
                borderRadius: 3,
              }}
            >
              <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                height="30px"
                alt="emoji"
              />

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
              <Skeleton width="90%" animation={false} />
              <Skeleton width="100%" animation={false} />
              <Skeleton width="70%" animation={false} />
            </Box>
          ))}
        </Box>
        <Box sx={{ px: 5, display: "flex" }}>
          <LoadingButton
            loading={loading}
            variant="contained"
            disabled={loading || session?.permission === "read-only"}
            size="large"
            sx={{
              borderRadius: 99,
              ml: "auto",
              mr: 5,
              mt: 5,
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => {
              setLoading(true);
              fetchRawApi(session, "spaces/tasks/boards", {
                method: "POST",
                params: {
                  board: JSON.stringify({
                    ...template,
                    columns: template.columns.map((c, o) => ({
                      ...c,
                      order: o,
                    })),
                  }),
                },
              }).then(async (res) => {
                // await mutate();
                if (onboarding) {
                  toast.success(
                    "Board created! You can explore other templates."
                  );
                  setLoading(false);
                  setOpen(false);
                  return;
                }
                router.push(`/tasks/boards/${res.id}`);
                setLoading(false);
              });
            }}
          >
            {session?.permission === "read-only"
              ? "You do not have permission to create a board"
              : "Create new board"}
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export const templates = [
  {
    for: [],
    category: "",
    name: "Blank board",
    columns: [],
  },
  {
    for: ["Student", "College student"],
    category: "School",
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
    category: "Personal",
    name: "Trip planning",
    columns: [
      { name: "Destination", emoji: "2708" },
      { name: "Accommodations", emoji: "1f3e0" },
      { name: "Transportation", emoji: "2708" },
      { name: "Activities", emoji: "270c" },
      { name: "Packing checklist", emoji: "1f9f3" },
    ],
  },
  {
    for: ["Social media manager", "Influencer", "Digital marketer"],
    category: "Work",
    name: "Social media planner",
    columns: [
      { name: "Content Creation", emoji: "1f4f7" },
      { name: "Engagement", emoji: "1f49d" },
    ],
  },
  {
    for: ["Home cook", "Meal prepper", "Dietitian"],
    category: "Personal",
    name: "Meal planning",
    columns: [
      { name: "Breakfast", emoji: "1f95e" },
      { name: "Lunch", emoji: "1f96a" },
      { name: "Dinner", emoji: "1f372" },
      { name: "Snacks", emoji: "1f95b" },
      { name: "Grocery List", emoji: "1f6d2" },
    ],
  },
  {
    for: ["Individual", "Investor", "Financial planner"],
    category: "Personal",
    name: "Financial Goals",
    columns: [
      { name: "Savings", emoji: "1f4b0" },
      { name: "Investments", emoji: "1f4b8" },
      { name: "Debt Repayment", emoji: "1f4b7" },
      { name: "Budgeting", emoji: "1f4c3" },
      { name: "Financial Education", emoji: "1f9d2" },
    ],
  },
  {
    for: ["Parent", "Family member"],
    category: "Personal",
    name: "Family Chores",
    columns: [
      { name: "Cleaning", emoji: "1f9f9" },
      { name: "Cooking", emoji: "1f373" },
      { name: "Laundry", emoji: "1f9fc" },
      { name: "Errands", emoji: "1f3e0" },
      { name: "Organization", emoji: "1f5c2" },
    ],
  },
  {
    for: ["Parent", "Family member"],
    category: "Personal",
    name: "Fitness planner",
    columns: [
      { name: "Cardio", emoji: "1f3c3" },
      { name: "Strength Training", emoji: "1f4aa" },
      { name: "Flexibility", emoji: "1f9d8" },
      { name: "Nutrition", emoji: "1f96a" },
    ],
  },
  {
    for: ["Student", "College student"],
    category: "School",
    name: "Finals Week Planner",
    columns: [
      { name: "Study Schedule", emoji: "1f4da" },
      { name: "Subject 1", emoji: "1f4d0" },
      { name: "Subject 2", emoji: "1f4d5" },
      { name: "Subject 3", emoji: "1f9ea" },
      { name: "Subject 4", emoji: "1f30d" },
    ],
  },
  {
    for: ["Job seeker", "Professional", "Career coach"],
    category: "Personal",
    name: "Career Planning",
    columns: [
      { name: "Self-Assessment", emoji: "1f4cb" },
      { name: "Skills Development", emoji: "1f9d1" },
      { name: "Goal Setting", emoji: "1f4c8" },
      { name: "Job Search", emoji: "1f50e" },
      { name: "Networking", emoji: "1f91d" },
      { name: "Interviews", emoji: "1f3a4" },
      { name: "Offers & Negotiation", emoji: "1f4b8" },
      { name: "Career Development", emoji: "1f4da" },
    ],
  },
  {
    for: ["High school student"],
    category: "School",
    name: "High school Time Management",
    columns: [
      { name: "Assignments", emoji: "1f4d3" },
      { name: "Study Schedule", emoji: "1f4da" },
      { name: "Extracurriculars", emoji: "1f3c3" },
      { name: "To-Do List", emoji: "2705" },
      { name: "Upcoming Tests", emoji: "1f4c8" },
    ],
  },
  {
    for: ["College student"],
    category: "School",
    name: "College Time Management",
    columns: [
      { name: "Class Schedule", emoji: "1f5a5" },
      { name: "Assignments", emoji: "1f4dd" },
      { name: "Study Plan", emoji: "1f4da" },
      { name: "Projects", emoji: "1f4c0" },
      { name: "Exams", emoji: "1f4c3" },
      { name: "Personal Time", emoji: "1f3be" },
    ],
  },
  {
    for: ["College student", "Job seeker"],
    category: "Personal",
    name: "College/Career Planning",
    columns: [
      { name: "Research", emoji: "1f50e" },
      { name: "College Applications", emoji: "1f4d3" },
      { name: "Scholarships", emoji: "1f4b0" },
      { name: "Internships", emoji: "1f4bb" },
      { name: "Job Offers", emoji: "1f4e9" },
      { name: "Career Goals", emoji: "1f4ca" },
    ],
  },
  {
    for: ["Student"],
    category: "School",
    name: "School Project",
    columns: [
      { name: "Research", emoji: "1f50e" },
      { name: "Planning", emoji: "1f4c3" },
      { name: "Design", emoji: "1f3a8" },
      { name: "Presentation", emoji: "1f4e2" },
      { name: "Submission", emoji: "2705" },
    ],
  },
  {
    for: ["Student", "Theater enthusiast"],
    category: "School",
    name: "School Drama Play",
    columns: [
      { name: "Script Selection", emoji: "1f4da" },
      { name: "Casting", emoji: "1f3a5" },
      { name: "Rehearsals", emoji: "1f3ad" },
      { name: "Costume Design", emoji: "1f457" },
      { name: "Set Design", emoji: "1f3a8" },
      { name: "Props", emoji: "1f6cd" },
      { name: "Lighting and Sound", emoji: "1f4e3" },
      { name: "Promotion", emoji: "1f3ac" },
      { name: "Performance", emoji: "1f3a9" },
    ],
  },
  {
    for: ["Student", "Sports enthusiast"],
    category: "School",
    name: "School Sports Team",
    columns: [
      { name: "Practice Schedule", emoji: "1f3c3" },
      { name: "Drills and Skills", emoji: "1f3c8" },
      { name: "Game Strategy", emoji: "1f3af" },
      { name: "Team Communication", emoji: "1f4ac" },
      { name: "Fitness and Conditioning", emoji: "1f3cb" },
      { name: "Competitions", emoji: "1f3c5" },
      { name: "Team Bonding", emoji: "1f3d6" },
      { name: "Achievements", emoji: "1f3c6" },
    ],
  },
  {
    for: ["Shopper", "Home cook"],
    category: "Personal",
    name: "Grocery List",
    columns: [
      { name: "Produce", emoji: "1f955" },
      { name: "Meat", emoji: "1f356" },
      { name: "Bakery", emoji: "1f35e" },
      { name: "Snacks", emoji: "1f95d" },
      { name: "Miscellaneous", emoji: "1f4aa" },
    ],
  },
  {
    for: ["High School Club"],
    category: "School",
    name: "Club Management",
    columns: [
      { name: "Tasks", emoji: "1f4cb" },
      { name: "Projects", emoji: "1f4c3" },
      { name: "Events", emoji: "1f3c3" },
      { name: "Finance", emoji: "1f4b0" },
    ],
  },
  {
    for: ["Event planner", "Organizer"],
    category: "Work",
    name: "Event Planning Checklist",
    columns: [
      { name: "Preparation", emoji: "1f4cc" },
      { name: "Venue Selection", emoji: "1f3e2" },
      { name: "Logistics", emoji: "1f69a" },
      { name: "Marketing", emoji: "1f4f7" },
      { name: "Execution", emoji: "1f3ad" },
    ],
  },
  {
    for: ["Traveler", "Adventurer"],
    category: "Personal",
    name: "Travel Itinerary",
    columns: [
      { name: "Destination Research", emoji: "1f310" },
      { name: "Transportation", emoji: "1f698" },
      { name: "Accommodation", emoji: "1f3e8" },
      { name: "Sightseeing", emoji: "1f30d" },
      { name: "Activities", emoji: "1f3c6" },
    ],
  },
  {
    for: ["Project manager", "Team leader"],
    category: "Work",
    name: "Project Management",
    columns: [
      { name: "Planning", emoji: "1f4c3" },
      { name: "Tasks", emoji: "1f4cb" },
      { name: "In Progress", emoji: "1f4dd" },
      { name: "Review", emoji: "1f4ca" },
      { name: "Completed", emoji: "2705" },
    ],
  },
  {
    for: ["Book lover", "Reader"],
    category: "Personal",
    name: "Book Reading List",
    columns: [
      { name: "To Read", emoji: "1f4d6" },
      { name: "Currently Reading", emoji: "1f4da" },
      { name: "On Hold", emoji: "23f8" },
      { name: "Read", emoji: "1f4d2" },
      { name: "Favorites", emoji: "2764" },
    ],
  },
  {
    for: ["Budget-conscious individual", "Financial planner"],
    category: "Personal",
    name: "Budget Tracker",
    columns: [
      { name: "Income", emoji: "1f4b8" },
      { name: "Expenses", emoji: "1f4c9" },
      { name: "Savings", emoji: "1f4b0" },
      { name: "Debts", emoji: "1f4b7" },
      { name: "Financial Goals", emoji: "1f4b5" },
    ],
  },
  {
    for: ["Music lover", "Playlist curator"],
    category: "Personal",
    name: "Music Playlist",
    columns: [
      { name: "Upbeat", emoji: "1f3b5" },
      { name: "Relaxing", emoji: "1f3b6" },
      { name: "Energetic", emoji: "1f525" },
      { name: "Chill", emoji: "1f30a" },
      { name: "Favorites", emoji: "2665" },
    ],
  },
  {
    for: ["Team members", "Collaborators"],
    category: "Work",
    name: "Project Collaboration",
    columns: [
      { name: "Ideation", emoji: "1f4a1" },
      { name: "Tasks", emoji: "1f4cb" },
      { name: "In Progress", emoji: "1f4dd" },
      { name: "Review", emoji: "1f4ca" },
      { name: "Completed", emoji: "2705" },
    ],
  },
  {
    for: ["Entrepreneur", "Business owner"],
    category: "Work",
    name: "Business Plan",
    columns: [
      { name: "Executive Summary", emoji: "1f4cc" },
      { name: "Market Research", emoji: "1f50e" },
      { name: "Product/Service Offering", emoji: "1f4e6" },
      { name: "Marketing Strategy", emoji: "1f4f7" },
      { name: "Financial Projections", emoji: "1f4b8" },
    ],
  },
  {
    for: ["Business owner", "Accountant"],
    category: "Work",
    name: "Business Expense Tracker",
    columns: [
      { name: "Office Supplies", emoji: "1f4dd" },
      { name: "Travel Expenses", emoji: "1f698" },
      { name: "Utilities", emoji: "1f4e6" },
      { name: "Marketing Expenses", emoji: "1f4f7" },
      { name: "Miscellaneous", emoji: "1f4aa" },
    ],
  },
  {
    for: ["Programmer", "Software developer"],
    category: "Work",
    name: "Programming Project Tracker",
    columns: [
      { name: "Planning", emoji: "1f4c3" },
      { name: "Development", emoji: "1f4bb" },
      { name: "Testing", emoji: "1f50e" },
      { name: "Bugs/Issues", emoji: "1f41b" },
      { name: "Completed", emoji: "2705" },
    ],
  },
  {
    for: ["Software developer", "Tech enthusiast"],
    category: "Work",
    name: "Tech Stack Overview",
    columns: [
      { name: "Front-end", emoji: "1f3a7" },
      { name: "Back-end", emoji: "1f6e0" },
      { name: "Database", emoji: "1f4c1" },
      { name: "DevOps", emoji: "2699" },
      { name: "Other Tools", emoji: "1f4bb" },
    ],
  },
];

export function CreateBoard({ parentRef, onboarding = false, mutate }: any) {
  const [currentOption, setOption] = useState("Board");
  const { session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<null | string>(null);
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

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <Box
      sx={{
        p: onboarding ? 0 : { xs: 2, sm: 5 },
        maxWidth: "100vw",
        pb: { xs: 50 },
      }}
    >
      {!onboarding && (
        <Head>
          <title>Explore &bull; {currentOption}s</title>
        </Head>
      )}
      {!onboarding && (
        <Box sx={{ textAlign: "center", my: 10 }}>
          <Typography variant="h1" className="font-heading" sx={{ mb: 1 }}>
            Explore
          </Typography>
          <Typography variant="h6">
            Do anything with hundreds of templates
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
      )}

      <Box sx={{ display: "flex", gap: 2, mb: { xs: 4, sm: 0 } }}>
        <Grid container spacing={2}>
          {[
            { color: "orange", name: "Work", icon: "work" },
            { color: "purple", name: "School", icon: "history_edu" },
            { color: "red", name: "Personal", icon: "celebration" },
            { color: "green", name: "Checklists", icon: "task_alt" },
          ].map((_category) => (
            <Grid item xs={12} sm={3} key={_category.name}>
              <CardActionArea
                onClick={() => {
                  setCategory(category ? null : _category.name);
                }}
                key={_category.name}
                sx={{
                  background: palette[3],
                  p: 2,
                  borderRadius: 5,
                }}
              >
                {/* {category} */}
                <Icon
                  className="outlined"
                  sx={{
                    color: colors[_category.color]["300"],
                    mb: 1,
                    fontSize: "30px!important",
                  }}
                >
                  {_category.icon}
                </Icon>
                <Typography variant="h5">{_category.name}</Typography>
                <Typography variant="body2">
                  {
                    templates.filter((d) => d.category === _category.name)
                      .length
                  }{" "}
                  templates
                </Typography>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          mt: 2,
          mb: 15,
        }}
      >
        <Virtuoso
          useWindowScroll
          customScrollParent={parentRef}
          data={templates
            .filter(
              (template) =>
                template.name
                  .toLowerCase()
                  .includes(deferredSearchQuery.toLowerCase()) ||
                template.category
                  .toLowerCase()
                  .includes(deferredSearchQuery.toLowerCase())
            )
            .filter((template) => category || true)
            .filter((template) => {
              if (onboarding && template.name === "Blank board") return false;
              return true;
            })}
          itemContent={(index, template) => (
            <Box key={template.name} sx={{ mb: 2 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Template
                  onboarding={onboarding}
                  template={template}
                  mutate={mutate}
                >
                  <Card
                    sx={{
                      background: palette[3],
                      borderRadius: 5,
                      maxWidth: "100%",
                      mx: "auto",
                      ...(template.name === "Blank board" &&
                        onboarding && {
                          display: "none",
                        }),
                    }}
                  >
                    <CardActionArea sx={{ height: "100%" }}>
                      <Box
                        sx={{
                          maxHeight: "70px",
                          overflow: "hidden",
                          position: "relative",
                          ...(template.name === "Blank board" && {
                            display: "none",
                          }),
                        }}
                      >
                        <Avatar
                          size="100%"
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
                        {template.category && (
                          <Chip
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              m: 1,
                              background: addHslAlpha(palette[2], 0.4),
                              backdropFilter: "blur(10px)",
                            }}
                            label={template.category}
                            size="small"
                          />
                        )}
                      </Box>
                      <Box sx={{ p: 3 }}>
                        <Typography
                          variant={onboarding ? "h5" : "h3"}
                          className={onboarding ? "" : "font-heading"}
                        >
                          {template.name}
                        </Typography>
                        {template.columns.length > 0 && (
                          <Typography
                            variant="body2"
                            gutterBottom
                            className="font-body"
                          >
                            {template.columns.length} columns
                          </Typography>
                        )}
                      </Box>
                    </CardActionArea>
                  </Card>
                </Template>
              </motion.div>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
