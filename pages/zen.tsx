import { openSpotlight } from "@mantine/spotlight";
import {
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { useRouter } from "next/router";
import { useHotkeys } from "react-hotkeys-hook";
import { CardOptions } from "../components/zen/CardOptions";
import { colors } from "../lib/colors";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { createRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DailyRoutine } from "../components/Coach/DailyRoutine";
import { Puller } from "../components/Puller";
import { updateSettings } from "../components/Settings/updateSettings";
import { getActions } from "../components/zen/getActions";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { useStatusBar } from "../hooks/useStatusBar";
import { toastStyles } from "../lib/useCustomTheme";

function DailyFocus({ editMode }) {
  const randomGoals = [
    "Exercise for 30 minutes",
    "Meditate for 10 minutes",
    "Drink 8 glasses of water",
    "Eat a healthy breakfast",
    "Read for 30 minutes",
    "Write in a journal for 10 minutes",
    "Call a friend or family member",
    "Spend time in nature",
    "Practice gratitude by listing 3 things you're thankful for",
    "Declutter and organize my home",
    "Plan and prepare meals for the day",
    "Take a 10-minute break every 2 hours",
    "Take a nap or rest for 20 minutes",
    "Spend 30 minutes learning a new skill",
    "Practice deep breathing for 5 minutes",
    "Do a random act of kindness for someone else",
    "Spend 30 minutes in quiet reflection",
    "Take time to enjoy a hobby",
    "Create a daily to-do list and prioritize tasks",
    "Spend time outside in the sun",
    "Spend 15 minutes in deep cleaning",
    "Listen to a podcast or audiobook",
    "Spend time in silence without technology",
    "Volunteer or give back to the community",
    "Take a walk or go for a run",
    "Spend time with a pet",
    "Try a new healthy recipe for dinner",
    "Spend 30 minutes practicing mindfulness",
    "Do a 15-minute home workout",
    "Set and work towards a daily savings goal",
    "Spend 15 minutes practicing self-care",
    "Spend time with loved ones",
    "Make a conscious effort to reduce waste and be eco-friendly",
    "Do a quick housecleaning and tidy up",
    "Spend time in solitude and introspection",
    "Get 8 hours of sleep",
    "Spend time with a friend or family member",
    "Visit a new place or try a new activity",
    "Focus on positive self-talk and avoid negative self-criticism",
    "Spend 15 minutes decluttering and organizing",
    "Create a budget and stick to it",
    "Spend time with a loved one or pet",
    "Spend 30 minutes in deep work or focusing on a task",
    "Take a relaxing bath or shower",
    "Spend time doing a creative activity",
    "Practice forgiveness and let go of grudges",
    "Touch grass",
  ];

  const ref: any = createRef();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        gap: 1,
      }}
    >
      <TextField
        multiline
        disabled={editMode}
        placeholder="What's your goal for today?"
        size="small"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            background: global.user.darkMode
              ? "hsla(240,11%,40%,.35)"
              : "rgba(200,200,200,.3)",
            border: "1px solid transparent",
            "&:focus-within": {
              background: global.user.darkMode
                ? "hsla(240,11%,10%,.5)"
                : "rgba(200,200,200,.3)",
              borderColor: global.user.darkMode
                ? "rgba(255,255,255,.5)"
                : "#000",
            },
            p: 2,
            py: 1,
            borderRadius: 2,
            mx: "auto",
          },
        }}
        inputRef={ref}
      />
      <IconButton
        onClick={(e: any) => {
          const g = randomGoals[Math.floor(Math.random() * randomGoals.length)];
          const chance = Math.random();

          if (g === "Touch grass" && chance > 0.1) {
            e.target.click();
          }
          ref.current.value = g;
        }}
      >
        <Icon className="outlined">casino</Icon>
      </IconButton>
    </Box>
  );
}

function CardGallery({ editMode, items, setItems }) {
  const [open, setOpen] = useState(false);
  useStatusBar(open);
  const actions = getActions(global.property.profile.type);

  return (
    <>
      <SwipeableDrawer
        open={open}
        PaperProps={{
          sx: {
            maxHeight: "95vh",
          },
        }}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor="bottom"
        disableSwipeToOpen
      >
        <Puller />
        <Box sx={{ px: 3, pb: 3 }}>
          {Object.keys(actions).map((category, index) => (
            <Box key={category}>
              <Typography
                variant="h6"
                sx={{ textTransform: "capitalize", mt: 1 }}
              >
                {category}
              </Typography>
              {actions[category].map((card, cardIndex) => (
                <Box key={"card-" + cardIndex}>
                  <ListItemButton
                    sx={{ borderRadius: 3 }}
                    disabled={items.includes(`${category}.${card.key}`)}
                    onClick={() => {
                      setItems(() => {
                        const newArray = [...items, `${category}.${card.key}`];
                        updateSettings(
                          "zenCardOrder",
                          JSON.stringify(newArray)
                        );
                        return newArray;
                      });
                      setOpen(false);
                    }}
                  >
                    <ListItemIcon>
                      <Icon className="outlined">{card.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={card.primary} />
                    <Icon className="outlined">
                      {items.includes(`${category}.${card.key}`)
                        ? "check_circle"
                        : "add_circle"}
                    </Icon>
                  </ListItemButton>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </SwipeableDrawer>
      <Button
        variant="contained"
        sx={{
          float: "right",
          transition: "opacity .2s !important",
          display: (!editMode && "none") as string,
        }}
        onClick={() => setOpen(true)}
      >
        <Icon>add</Icon>Add card
      </Button>
    </>
  );
}

function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    activeIndex,
  } = useSortable({
    id: props.id,
    transition: {
      duration: 150, // milliseconds
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const actions = getActions(global.property.profile.type);
  const category = props.id.split(".")[0];
  const action = props.id.split(".")[1];

  const data = actions[category].find((e) => e.key === action);
  const activeStyles = {
    background: global.user.darkMode
      ? "hsla(240,11%,60%,.5)"
      : "rgba(200,200,200,.5)!important",
    backdropFilter: "blur(10px)",
    zIndex: "9999999999!important",
    transition: "all .2s!important",
    cursor: "grabbing",
  };
  return (
    <div
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div
        style={{
          ...(props.editMode && { animation: "jiggle .2s infinite" }),
          display: "flex",
          alignItems: "center",
        }}
        className="containerListItem"
      >
        <ListItemButton
          onClick={() => {
            if (data.onClick) {
              data.onClick();
            } else {
              toast.error(
                "Invalid action - You shouldn't be seeing this error. Please contact support",
                toastStyles
              );
            }
          }}
          disableRipple={props.editMode}
          onContextMenu={() => props.setEditMode(true)}
          ref={setNodeRef}
          sx={{
            opacity: "1!important",
            ...(activeIndex === props.index && activeStyles),
            ...(props.editMode && {
              borderTopRightRadius: "0px!important",
              borderBottomRightRadius: "0px!important",
              "&:active": activeStyles,
            }),
            cursor: "grabbing",
          }}
          {...attributes}
          {...listeners}
        >
          {props.editMode && <Icon>drag_indicator</Icon>}
          <Icon className="outlined">{data.icon}</Icon>
          <ListItemText primary={data.primary} />
        </ListItemButton>
        {props.editMode && (
          <CardOptions
            items={props.items}
            setItems={props.setItems}
            option={props.id}
          />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const time = new Date().getHours();
  const [editMode, setEditMode] = useState(false);
  useHotkeys("alt+e", (e) => {
    e.preventDefault();
    setEditMode((e) => !e);
  });

  useEffect(() => {
    editMode ? neutralizeBack(() => setEditMode(false)) : revivalBack();
  });

  let greeting;
  if (time < 10) {
    greeting = "Good morning, ";
  } else if (time < 14) {
    greeting = "Good afternoon, ";
  } else if (time < 18) {
    greeting = "Good evening, ";
  } else {
    greeting = "Good night, ";
  }
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        updateSettings("zenCardOrder", JSON.stringify(newArray));

        return newArray;
      });
    }
    document.body.classList.remove("overflow-hidden");
  };
  const handleDragStart = () => {
    document.body.classList.add("overflow-hidden");
  };

  useHotkeys("esc", () => setEditMode(false));

  const order = {
    top: ["tasks", "goals"],
    bottom: JSON.parse(global.user.zenCardOrder) || [
      "goals.study_plan",
      "inventory.starred",
      "inventory.scan",
      "achievements.trigger",
    ],
  };

  const [items, setItems] = useState(order.bottom);

  return (
    <>
      <div className="px-7">
        <div
          className="blur-spotlight sm:hidden"
          style={{
            background: `linear-gradient(45deg, ${colors[themeColor]["A100"]}, ${colors[themeColor]["A400"]} 50%, ${colors[themeColor]["A200"]})`,
            opacity: global.user.darkMode ? 0.5 : 0.9,
          }}
        />
        <Box
          sx={{
            mt: { xs: "calc(var(--navbar-height) * -1)", sm: "0" },
            pt: 8,
          }}
        >
          <Box
            sx={{
              display: "flex",
              mb: 2,
              alignItems: "center",
              pr: 2,
              gap: 1,
              height: "var(--navbar-height)",
              position: { xs: editMode ? "fixed" : "absolute", sm: "static" },
              background: global.user.darkMode
                ? "hsla(240,11%,10%, .5)"
                : "rgba(255,255,255,.5)",
              top: 0,
              backdropFilter: "blur(10px)",
              zIndex: 9,
              left: 0,
              width: "100%",
            }}
          >
            <Box
              sx={{
                ml: "auto",
              }}
            >
              <Tooltip title={editMode ? "Save" : "Edit start"}>
                <IconButton
                  sx={{
                    mr: 0.5,
                    ...(editMode && {
                      background: global.user.darkMode
                        ? "hsl(240,11%,25%)!important"
                        : "rgba(200,200,200,.3)!important",
                    }),
                  }}
                  onClick={() => setEditMode(!editMode)}
                >
                  <Icon className="outlined">
                    {editMode ? "check" : "edit"}
                  </Icon>
                </IconButton>
              </Tooltip>
              {!editMode && (
                <Tooltip title="Jump to" placement="bottom-start">
                  <IconButton onClick={() => openSpotlight()}>
                    <Icon className="outlined">search</Icon>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Typography
            className="font-heading"
            sx={{
              fontSize: {
                xs: "40px",
                sm: "35px",
              },
              my: 4,
              mb: 2,
            }}
            variant="h5"
          >
            {greeting}
            {global.user.name.includes(" ")
              ? global.user.name.split(" ")[0]
              : global.user.name}
            !
          </Typography>
          <DailyFocus editMode={editMode} />
          <Chip
            icon={
              <>
                <Icon
                  sx={{ color: "inherit!important", ml: 1, mr: -1, mt: -0.2 }}
                  className="outlined"
                >
                  local_fire_department
                </Icon>
              </>
            }
            label="10 days"
            sx={{
              userSelect: "none",
              color: orange["A400"],
              mr: 1,
            }}
          />

          <CardGallery setItems={setItems} items={items} editMode={editMode} />
          <List
            sx={{
              mt: 2,
              "& .MuiListItemButton-root": {
                ...(editMode && {
                  background: global.user.darkMode
                    ? "hsla(240,11%,60%,.1)"
                    : "rgba(200,200,200,.3)",
                  transformOrigin: "top center",
                }),
                ...(!editMode && {
                  "&:active": {
                    transform: "scale(.98)",
                    transition: "none",
                  },
                }),
                transition: "margin .2s, transform .2s",
                borderRadius: 3,
                mb: !editMode ? 0.2 : 1.5,
                gap: 2,
                px: 1,
              },
            }}
          >
            {order.top.map((card) =>
              card == "tasks" ? (
                <ListItemButton
                  disableRipple={editMode}
                  onClick={() => !editMode && router.push("/tasks")}
                >
                  <Icon className="outlined">check_circle</Icon>
                  <ListItemText
                    primary="Tasks"
                    secondary={!editMode && "5 tasks left to reach daily goal"}
                  />
                </ListItemButton>
              ) : (
                <DailyRoutine zen editMode={editMode} />
              )
            )}

            <DndContext
              collisionDetection={closestCenter}
              sensors={editMode ? sensors : []}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((id, index) => (
                  <SortableItem
                    setEditMode={setEditMode}
                    index={index}
                    key={id}
                    id={id}
                    editMode={editMode}
                    items={items}
                    setItems={setItems}
                  />
                ))}
              </SortableContext>
              <DragOverlay />
            </DndContext>
          </List>
        </Box>
        <Toolbar />
      </div>
    </>
  );
}
