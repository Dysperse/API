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
import { openSpotlight } from "@mantine/spotlight";
import {
  Box,
  Button,
  Icon,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { DailyRoutine } from "../components/Coach/DailyRoutine";
import { Puller } from "../components/Puller";
import { updateSettings } from "../components/Settings/updateSettings";
import { CardOptions } from "../components/Zen/CardOptions";
import { DailyCheckIn } from "../components/Zen/DailyCheckIn";
import { getActions } from "../components/Zen/getActions";
import { useApi } from "../hooks/useApi";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { colors } from "../lib/colors";
import { toastStyles } from "../lib/useCustomTheme";
import { useSession } from "./_app";

function CardGallery({ editMode, items, setItems }) {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const actions = getActions(session.property.profile.type);

  return (
    <>
      <SwipeableDrawer
        open={open}
        PaperProps={{
          sx: { maxHeight: "95vh" },
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
                    sx={{
                      width: "100%",
                      px: "15px !important",
                      background: session?.user?.darkMode
                        ? "hsl(240, 11%, 10%)"
                        : "#fff",
                      border: "1px solid",
                      borderColor: session?.user?.darkMode
                        ? "hsl(240, 11%, 20%)"
                        : "rgba(200, 200, 200, 0.3)",
                    }}
                    className="shadow-md"
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
      <Box sx={{ display: "flex", mt: 5 }}>
        <Button
          variant="contained"
          sx={{
            ml: "auto",
            px: 2,
            pr: 2.5,
            transition: "opacity .2s !important",
            display: (!editMode && "none") as string,
          }}
          onClick={() => setOpen(true)}
        >
          <Icon>add</Icon>Add card
        </Button>
      </Box>
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

  const session = useSession();
  const actions = getActions(session.property.profile.type);
  const category = props.id.split(".")[0];
  const action = props.id.split(".")[1];

  const data =
    actions[category] && actions[category].find((e) => e.key === action);

  const activeStyles = {
    background: session?.user?.darkMode
      ? "hsla(240,11%,60%,.5)"
      : "rgba(200,200,200,.5)!important",
    backdropFilter: "blur(10px)",
    zIndex: "9999999999!important",
    transition: "all .2s!important",
    cursor: "grabbing",
  };
  return (
    data && (
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
              width: "100%",
              px: "15px !important",
              background: session?.user?.darkMode
                ? "hsl(240, 11%, 10%)"
                : "#fff",
              border: "1px solid",
              borderColor: session?.user?.darkMode
                ? "hsl(240, 11%, 20%)"
                : "rgba(200, 200, 200, 0.3)",
              opacity: "1!important",
              ...(activeIndex === props.index && activeStyles),
              ...(props.editMode && {
                borderTopRightRadius: "0px!important",
                borderBottomRightRadius: "0px!important",
                "&:active": activeStyles,
              }),
              mb: "13px!important",
              cursor: "grabbing",
            }}
            className="shadow-md"
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
    )
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
  const session = useSession();

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
    bottom: JSON.parse(session?.user?.zenCardOrder) || [
      "goals.study_plan",
      "inventory.starred",
      "inventory.scan",
    ],
  };

  const [items, setItems] = useState(order.bottom);

  const { data, url, error } = useApi("property/boards/agenda", {
    startTime: dayjs().startOf("day").toISOString(),
    endTime: dayjs().endOf("day").toISOString(),
  });
  return (
    <>
      <div className="px-7">
        <Box
          sx={{
            mt: { xs: "calc(var(--navbar-height) * -1)", sm: "-50px" },
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
              background: session?.user?.darkMode
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
                      background: session?.user?.darkMode
                        ? "hsl(240,11%,25%)!important"
                        : "rgba(200,200,200,.3)!important",
                    }),
                  }}
                  onClick={() => {
                    navigator.vibrate(50);
                    setEditMode(!editMode);
                  }}
                >
                  <Icon className="outlined">
                    {editMode ? "check" : "edit"}
                  </Icon>
                </IconButton>
              </Tooltip>
              {!editMode && (
                <Tooltip title="Jump to" placement="bottom-start">
                  <IconButton
                    onClick={() => {
                      navigator.vibrate(50);
                      openSpotlight();
                    }}
                    sx={{
                      display: { sm: "none" },
                    }}
                  >
                    <Icon className="outlined">bolt</Icon>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              my: 4,
              mb: { xs: 0, sm: 4 },
              alignItems: { sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                className="font-heading"
                sx={{
                  fontSize: {
                    xs: "40px",
                    sm: "50px",
                  },
                  mb: 1,
                }}
                variant="h5"
              >
                {greeting}
                {session?.user?.name.includes(" ")
                  ? session?.user?.name.split(" ")[0]
                  : session?.user?.name}
                !
              </Typography>
            </Box>
            <Box>
              <DailyCheckIn />
            </Box>
          </Box>

          <CardGallery setItems={setItems} items={items} editMode={editMode} />
          <List
            sx={{
              mt: 2,
              "& .MuiListItemButton-root": {
                ...(editMode && {
                  background: session?.user?.darkMode
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
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                mb: 2,
              }}
            >
              {order.top.map((card) =>
                card == "tasks" ? (
                  <ListItemButton
                    sx={{
                      width: "100%",
                      px: "15px !important",
                      background: session?.user?.darkMode
                        ? "hsl(240, 11%, 10%)"
                        : "#fff",
                      border: "1px solid",
                      borderColor: session?.user?.darkMode
                        ? "hsl(240, 11%, 20%)"
                        : "rgba(200, 200, 200, 0.3)",
                    }}
                    className="shadow-md"
                    disableRipple={editMode}
                    onClick={() =>
                      !editMode && router.push("/tasks/#/agenda/week")
                    }
                  >
                    <Icon>task_alt</Icon>
                    <ListItemText
                      primary={<b>Today&apos;s agenda</b>}
                      secondary={
                        !editMode && data
                          ? data && data.length == 0
                            ? "You don't have any tasks scheduled for today"
                            : data &&
                              data.length -
                                data.filter((task) => task.completed).length ==
                                0
                            ? "Great job! You finished all your tasks today!"
                            : `You have ${
                                data &&
                                data.length -
                                  data.filter((task) => task.completed).length
                              } tasks remaining for today`
                          : !editMode && "Loading..."
                      }
                    />
                    {data &&
                      data.length -
                        data.filter((task) => task.completed).length ==
                        0 && (
                        <Icon
                          sx={{
                            color:
                              colors.green[
                                session?.user?.darkMode ? "A400" : "A700"
                              ],
                            fontSize: "30px!important",
                          }}
                        >
                          check_circle
                        </Icon>
                      )}
                  </ListItemButton>
                ) : (
                  <DailyRoutine zen editMode={editMode} />
                )
              )}
            </Box>

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
