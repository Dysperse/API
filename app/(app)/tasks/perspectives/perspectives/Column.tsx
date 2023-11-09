import SelectDateModal from "@/app/(app)/tasks/Task/DatePicker";
import { Emoji } from "@/components/Emoji";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Box,
  Button,
  Icon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, {
  cloneElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import { PerspectiveContext, sortedTasks } from ".";
import { Task } from "../../Task";
import { CreateTask } from "../../Task/Create";
import { SelectionContext } from "../../selection-context";
import { Header } from "./Header";

function UnfinishedTasks({ column, completedTasks, data }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const taskSelection = useContext(SelectionContext);

  const handleOpen = () => {
    taskSelection.set([
      -2,
      ...data
        .filter((d) => !completedTasks.find((f) => f.id === d.id))
        .map((e) => e.id),
    ]);
  };
  const isActive = taskSelection.values.includes(-2);

  const handleNext = () => {
    if (isActive) {
    }
  };

  const handleSubmit = async (newDate) => {
    try {
      const res = await fetchRawApi(session, "space/tasks/task/many", {
        method: "PUT",
        params: {
          selection: JSON.stringify(
            taskSelection.values.filter((e) => e !== -2)
          ),
          due: newDate,
        },
      });
      if (res.errors !== 0) {
        toast.error(
          `Couldn't edit ${res.errors} item${res.errors == 1 ? "" : "s"}`
        );
        return;
      }
      document.getElementById("taskMutationTrigger")?.click();
      toast.success(`Updated due date!`);
      taskSelection.set([]);
    } catch {
      toast.error(`Couldn't update due dates! Please try again later`);
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          px: 3,
          pt: 0,
          pb: 1,
          mt: -20,
          transition: "opacity .5s, margin .5s",
          ...(taskSelection.values.length > 0 &&
            !taskSelection.values.includes(-2) && {
              opacity: 0,
              mt: -10,
              pointerEvents: "none",
            }),
          ...(isActive && {
            position: { xs: "fixed", sm: "absolute" },
            mt: 0,
            zIndex: 999999,
            top: 0,
            left: 0,
            width: "100%",
            px: 2,
            py: 2,
            background: palette[1],
          }),
        }}
      >
        <Box
          onClick={handleOpen}
          sx={{
            p: 2,
            borderRadius: 5,
            background: palette[3],
            width: "100%",
            alignItems: "center",
            display: "flex",
            "&:active": { opacity: isActive ? 1 : 0.6 },
          }}
        >
          {isActive && (
            <Avatar
              sx={{ mr: 2, background: palette[5] }}
              onClick={(e) => {
                e.stopPropagation();
                taskSelection.set([]);
              }}
            >
              <Icon className="outlined">close</Icon>
            </Avatar>
          )}
          <Box>
            <Typography sx={{ fontWeight: 500 }}>
              {isActive
                ? `${taskSelection.values.length - 1} selected`
                : "Reschedule unfinished tasks?"}
            </Typography>
          </Box>
          <SelectDateModal
            closeOnSelect
            date={dayjs(column)}
            dateOnly
            setDate={handleSubmit}
          >
            <Avatar
              sx={{ ml: "auto", background: palette[5] }}
              onClick={handleNext}
            >
              <Icon className="outlined">
                {isActive ? "arrow_forward_ios" : "edit_calendar"}
              </Icon>
            </Avatar>
          </SelectDateModal>
        </Box>
      </Box>
    </>
  );
}

function RandomTask({ children, date }) {
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

  const trigger = cloneElement(children, {
    onTouchStart: handleClick,
    onMouseDown: handleClick,
  });

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
      {trigger}
    </CreateTask>
  );
}

const Column = React.memo(function Column({
  start,
  end,
  data,
  view,
  isToday
}: any): JSX.Element {
  const scrollParentRef = useRef();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const { mutateList, type } = useContext(PerspectiveContext);

  const [isScrolling, setIsScrolling] = useState(false);

  const taskSelection = useContext(SelectionContext);
  const isPushingUnfinished = taskSelection.values.includes(-2);

  const completedTasks = useMemo(
    () =>
      data.filter((taskData) => {
        const isRecurring = taskData.recurrenceRule !== null;
        const isCompleted = isRecurring
          ? taskData.completionInstances.find((instance) =>
              dayjs(instance.iteration)
                .startOf("day")
                .isSame(dayjs(taskData.recurrenceDay).startOf("day"))
            )
          : taskData.completionInstances?.length > 0;

        return isCompleted;
      }),
    [data]
  );

  const showEmptyState = useMemo(
    () => data?.length == 0 || completedTasks.length === data?.length,
    [data.length, completedTasks.length]
  );

  const mutateTaskList = useCallback(
    (updatedTask) => {
      if (!updatedTask) {
        return mutateList();
      }
      mutateList(
        (oldDates) => {
          const index = oldDates.findIndex(({ start: _start, end: _end }) =>
            dayjs(start).isBetween(
              _start,
              _end,
              {
                days: "day",
                weeks: "week",
                months: "month",
              }[type],
              "[]"
            )
          );
          return oldDates.map((col, colIndex) => {
            if (colIndex !== index) return col;
            return {
              ...col,
              tasks: sortedTasks(
                col.tasks.map((d) => {
                  return d.id === updatedTask.id ? updatedTask : d;
                }),
                col
              ),
            };
          });
        },
        {
          revalidate: false,
        }
      );
    },
    [type, mutateList, start]
  );

  return (
    <Box
      ref={scrollParentRef}
      {...(isToday && { id: "active" })}
      sx={{
        position: "relative",
        height: "auto",
        flex: { xs: "0 0 100%", sm: "0 0 320px" },
        width: { xs: "100%", sm: "320px" },
        borderRight: { sm: "2px solid" },
        ...(!isMobile && {
          overflowY: "auto",
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
          borderLeft: "2px solid",
        }),
        borderColor: { sm: addHslAlpha(palette[4], 0.8) },
        ...(isMobile &&
          taskSelection.values.includes(-2) && {
            "& .header": { opacity: 0, mt: -15, pointerEvents: "none" },
          }),

        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
          backgroundColor: palette[3],
        },
        "&:hover::-webkit-scrollbar-thumb, &:hover *::-webkit-scrollbar-thumb":
          {
            backgroundColor: palette[4],
          },
        "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
          {
            backgroundColor: palette[5],
          },
        "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
          {
            backgroundColor: palette[5],
          },
        "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
          {
            backgroundColor: palette[5],
          },
        "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
          backgroundColor: "transparent",
        },
        "& .desktopColumnMenu": {
          opacity: 0,
        },
        "&:hover .desktopColumnMenu": {
          opacity: 1,
        },
      }}
    >
      <Header
        column={start}
        isToday={isToday}
        sortedTasks={data}
        columnEnd={end}
        type={type}
      />
      <Box sx={{ px: { sm: 1 } }} className="content">
        <Box
          sx={{
            display: showEmptyState ? "flex" : "none",
            justifyContent: "center",
            mx: "auto",
            py: { sm: 2 },
            px: { xs: 3, sm: 2 },
            mb: 2,
            alignItems: { xs: "center", sm: "start" },
            textAlign: { xs: "center", sm: "left" },
            flexDirection: "column",
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
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                background: palette[2],
                border: `2px solid ${palette[4]}`,
                borderRadius: 5,
                py: 5,
                px: 4,
                gap: 2,
                mt: { xs: 2, sm: -2 },
              }}
            >
              <Avatar sx={{ width: 70, height: 70 }}>
                <Emoji emoji="1f389" size={30} />
              </Avatar>
              <Typography
                variant="h5"
                sx={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {data.length === 0 ? "No tasks!" : "You finished everything!"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <RandomTask date={start}>
                  <Button variant="outlined" sx={{ px: 2 }}>
                    <Icon className="outlined">casino</Icon>
                  </Button>
                </RandomTask>
                <CreateTask
                  onSuccess={() => mutateList()}
                  defaultDate={dayjs(start).utc().toDate()}
                >
                  <Button variant="contained" sx={{ px: 2 }}>
                    <Icon className="outlined">add_circle</Icon>New
                  </Button>
                </CreateTask>
              </Box>
            </Box>
          </motion.div>
        </Box>
        {/* unfinished tasks indicator */}
        {!isToday &&
          dayjs(start).isBefore(dayjs()) &&
          completedTasks.length !== data?.length &&
          data?.length !== 0 && (
            <Box
              sx={{
                mt: taskSelection.values.length ? 0 : 20,
                transition: "margin .5s",
              }}
            >
              <UnfinishedTasks
                data={data}
                completedTasks={completedTasks}
                column={start}
              />
            </Box>
          )}
        <Virtuoso
          initialItemCount={data.length < 10 ? data.length : 10}
          useWindowScroll
          isScrolling={setIsScrolling}
          customScrollParent={isMobile ? undefined : scrollParentRef.current}
          data={
            isPushingUnfinished
              ? data.filter((d) => !completedTasks.find((f) => f.id === d.id))
              : data
          }
          itemContent={(_, task) => (
            <Task
              recurringInstance={task.recurrenceDay}
              isAgenda
              isDateDependent={true}
              key={task.id}
              isScrolling={isScrolling}
              board={task.board || false}
              columnId={task.column ? task.column.id : -1}
              mutateList={mutateTaskList}
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
