import { containerRef } from "@/components/Layout";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Icon,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { RRule } from "rrule";
import { PerspectiveContext } from ".";
import { Task } from "../Task";
import { CreateTask } from "../Task/Create";
import { Header } from "./Header";

function RandomTask({ date }) {
  const taskIdeas = [
    {
      name: "Write a Poem",
      description: "Compose a creative poem about a topic of your choice.",
    },
    {
      name: "Take a Nature Walk",
      description:
        "Explore the outdoors and take a leisurely walk in a natural setting.",
    },
    {
      name: "Learn a New Recipe",
      description:
        "Discover a new recipe and try cooking a meal from a different cuisine.",
    },
    {
      name: "Read a Chapter",
      description:
        "Dedicate time to reading a chapter from a book you've been meaning to finish.",
    },
    {
      name: "Sketch Something",
      description:
        "Unleash your artistic side by sketching an object, scene, or person.",
    },
    {
      name: "Listen to a Podcast",
      description:
        "Select an interesting podcast episode and listen while you go about your day.",
    },
    {
      name: "Stretch Routine",
      description:
        "Engage in a 10-minute stretching routine to boost flexibility and relaxation.",
    },
    {
      name: "Write a Gratitude Journal",
      description:
        "List things you're grateful for in a journal to foster a positive mindset.",
    },
    {
      name: "Solve a Puzzle",
      description:
        "Challenge your mind with a puzzle or brainteaser to enhance cognitive skills.",
    },
    {
      name: "Call a Friend",
      description:
        "Reach out to a friend for a catch-up conversation and strengthen connections.",
    },
    {
      name: "Try Meditation",
      description:
        "Set aside time to meditate and achieve mental clarity and relaxation.",
    },
    {
      name: "Learn a Dance Move",
      description:
        "Pick a dance tutorial online and learn a new move to get your body grooving.",
    },
    {
      name: "Visit a Local Museum",
      description:
        "Explore the cultural offerings of your area by visiting a nearby museum.",
    },
    {
      name: "Plan a Day Trip",
      description:
        "Research and plan an itinerary for a day trip to a nearby town or attraction.",
    },
    {
      name: "Do a Digital Declutter",
      description:
        "Organize your digital spaces by deleting or organizing files, photos, and emails.",
    },
    {
      name: "Write a Short Story",
      description:
        "Exercise your imagination by writing a short fictional story or narrative.",
    },
    {
      name: "Practice a Musical Instrument",
      description:
        "Spend time practicing and improving your skills on a musical instrument.",
    },
    {
      name: "Complete a Workout",
      description:
        "Follow a workout routine to stay active and maintain your fitness goals.",
    },
    {
      name: "Research a New Topic",
      description:
        "Delve into a subject you're curious about and expand your knowledge.",
    },
    {
      name: "Volunteer Virtually",
      description:
        "Find a virtual volunteering opportunity to contribute to a cause you care about.",
    },
    {
      name: "Capture a Photo",
      description:
        "Capture an interesting moment or scene through photography using your smartphone or camera.",
    },
    {
      name: "Try a New Hairstyle",
      description:
        "Experiment with a different hairstyle or hairdo to change up your look.",
    },
    {
      name: "Watch a Documentary",
      description:
        "Select a documentary film to learn about a specific topic or real-life story.",
    },
    {
      name: "Plan my dream vacation",
      description:
        "Research and plan the details of your dream vacation, from destinations to activities.",
    },
    {
      name: "Learn a Magic Trick",
      description:
        "Amaze your friends by mastering a magic trick and performing it with flair.",
    },
    {
      name: "Do a Random Act of Kindness",
      description:
        "Brighten someone's day by performing a small act of kindness without expecting anything in return.",
    },
    {
      name: "Write a Letter",
      description:
        "Compose a handwritten letter to a friend, family member, or yourself.",
    },
    {
      name: "Create a Vision Board",
      description:
        "Gather images and words that represent your goals and aspirations on a digital or physical vision board.",
    },
    {
      name: "Try a New Workout",
      description:
        "Experiment with a different workout routine to challenge your body in new ways.",
    },
    {
      name: "Organize my closet",
      description:
        "Sort through your clothes, shoes, and accessories to declutter and reorganize your closet.",
    },
  ];

  const [random, setRandom] = useState(1);

  const handleClick = () => {
    setRandom(Math.floor(Math.random() * taskIdeas.length));
  };

  return (
    <CreateTask
      defaultDate={date}
      defaultFields={{
        date: date,
        title: capitalizeFirstLetter(taskIdeas[random].name.toLowerCase()),
        description: taskIdeas[random].description,
      }}
      disableBadge
    >
      <IconButton
        onTouchStart={handleClick}
        onMouseDown={handleClick}
        size="large"
        sx={{
          ml: "auto",
          mr: -1,
          "&:active": {
            opacity: 0.6,
          },
        }}
      >
        <Icon className="outlined">casino</Icon>
      </IconButton>
    </CreateTask>
  );
}

const Column = React.memo(function Column({
  column,
  data,
  view,
  recurringTasks,
}: any): JSX.Element {
  const scrollParentRef = useRef();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const { mutateList, type, start } = useContext(PerspectiveContext);

  const columnStart = dayjs(column).startOf(type).toDate();
  const columnEnd = dayjs(columnStart).endOf(type).toDate();

  const [isScrolling, setIsScrolling] = useState(false);

  const heading = {
    days: "DD",
    weeks: "#W",
    months: "YYYY",
  }[type];

  const columnMap = {
    days: "day",
    weeks: "week",
    months: "month",
  }[type];

  const subheading = {
    days: "dddd",
    weeks: "D",
    months: "MMM",
  }[type];

  const isToday = dayjs(column).isSame(dayjs().startOf(columnMap), type);

  // stupid virtuoso bug
  const [_, setRerender] = useState(false);
  useEffect(() => {
    setRerender(true);
  }, []);

  const recurredTasks = recurringTasks
    .map((task) => {
      const rule = RRule.fromString(
        `DTSTART:${dayjs(columnEnd).format("YYYYMMDDTHHmmss[Z]")}\n` +
          (task.recurrenceRule.includes("\n")
            ? task.recurrenceRule?.split("\n")[1]
            : task.recurrenceRule)
      ).between(
        dayjs(columnStart).utc().startOf(type).toDate(),
        dayjs(columnEnd).utc().startOf(type).toDate(),
        true
      );
      return rule.length > 0 ? { ...task, recurrenceDay: rule } : undefined;
    })
    .filter((e) => e);

  /**
   * Sort the tasks in a "[pinned, incompleted, completed]" order
   */
  const sortedTasks = useMemo(
    () =>
      [...data, ...recurredTasks]
        .filter((task) => {
          if (task.recurrenceRule) return true;
          const dueDate = new Date(task.due);
          return dueDate >= columnStart && dueDate <= columnEnd;
        })
        .sort((e, d) =>
          e.completionInstances.length !== 0 &&
          d.completionInstances.length == 0
            ? 1
            : (e.completionInstances.length == 0 &&
                d.completionInstances.length !== 0) ||
              (e.pinned && !d.pinned)
            ? -1
            : !e.pinned && d.pinned
            ? 1
            : 0
        ),
    [recurredTasks, data, columnEnd, columnStart]
  );

  return (
    <Box
      ref={scrollParentRef}
      {...(isToday && { id: "active" })}
      sx={{
        height: "auto",
        flex: { xs: "0 0 100%", sm: "0 0 320px" },
        width: { xs: "100%", sm: "320px" },
        borderRight: { sm: "1.5px solid" },
        ...(!isMobile && {
          overflowY: "scroll",
        }),
        ...(view === "priority" &&
          !isToday && {
            opacity: 0.2,
            filter: "blur(5px)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              opacity: 1,
              filter: "none",
            },
          }),
        ...(view === "priority" && {
          borderLeft: "1.5px solid",
        }),
        borderColor: { sm: addHslAlpha(palette[4], 0.5) },
      }}
    >
      <Header
        subheading={subheading}
        column={column}
        isToday={isToday}
        columnMap={columnMap}
        sortedTasks={sortedTasks}
        heading={heading}
        columnEnd={columnEnd}
      />
      <Box sx={{ px: { sm: 1 } }}>
        {recurredTasks?.length === 0 && sortedTasks?.length == 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: "auto",
              py: { sm: 2 },
              alignItems: { xs: "center", sm: "start" },
              textAlign: { xs: "center", sm: "left" },
              flexDirection: "column",
              "& img": {
                display: { sm: "none" },
              },
            }}
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  maxWidth: "calc(100% - 10px)",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: palette[2],
                  borderRadius: 5,
                  py: 2,
                  px: 3,
                  mt: -1,
                }}
              >
                <Typography variant="h6">
                  {sortedTasks.length === 0 && recurredTasks.length == 0
                    ? "No tasks"
                    : "You finished everything!"}
                </Typography>
                <RandomTask date={column} />
              </Box>
            </motion.div>
          </Box>
        )}
        <Virtuoso
          useWindowScroll
          isScrolling={setIsScrolling}
          customScrollParent={
            isMobile ? containerRef.current : scrollParentRef.current
          }
          data={sortedTasks}
          itemContent={(_, task) => (
            <Task
              recurringInstance={task.recurrenceDay}
              isAgenda
              isDateDependent={true}
              key={task.id}
              isScrolling={isScrolling}
              board={task.board || false}
              columnId={task.column ? task.column.id : -1}
              mutate={() => {}}
              mutateList={mutateList}
              task={task}
            />
          )}
        />
        <Box sx={{ height: { xs: "calc(130px + var(--sab))", sm: "10px" } }} />
      </Box>
    </Box>
  );
});
export default Column;
