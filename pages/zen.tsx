import { openSpotlight } from "@mantine/spotlight";
import {
  Box,
  Button,
  Chip,
  Divider,
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Puller } from "../components/Puller";
import { updateSettings } from "../components/Settings/updateSettings";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { useStatusBar } from "../hooks/useStatusBar";
import { toastStyles } from "../lib/useCustomTheme";

const actions = {
  goals: [
    { key: "study_plan", primary: "Create a study plan", icon: "school" },
    { key: "set_goal", primary: "Set a goal", icon: "mindfulness" },
  ],
  inventory: [
    { key: "starred", primary: "Starred", icon: "star" },
    { key: "scan", primary: "Scan items", icon: "view_in_ar" },
  ],
  achievements: [
    {
      key: "trigger",
      primary: "Achievements",
      icon: "insights",
      onClick: () => document.getElementById("achievementsTrigger")?.click(),
    },
    {
      key: "my_productivity",
      primary: "My productivity",
      icon: "auto_awesome",
      onClick: () => document.getElementById("achievementsTrigger")?.click(),
    },
  ],
  groups: [
    {
      key: "trigger",
      primary: "Switch groups",
      icon: "swap_horiz",
      onClick: () => document.getElementById("houseProfileTrigger")?.click(),
    },
    {
      key: "group_info",
      primary: "Group info",
      icon: "home",
      onClick: () => document.getElementById("activeProperty")?.click(),
    },
  ],
};

function CardGallery({ editMode, items, setItems }) {
  const [open, setOpen] = useState(false);
  useStatusBar(open);

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

  // console.logs(activeIndex, props.index);

  const category = props.id.split(".")[0];
  const action = props.id.split(".")[1];

  const data = actions[category].find((e) => e.key === action);
  const activeStyles = {
    background: "rgba(200,200,200,.3)!important",
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
            background: `linear-gradient(45deg, ${colors[themeColor]["A200"]}, ${colors[themeColor]["A700"]} 50%, ${colors[themeColor]["A400"]})`,
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
                "&:focus-within": {
                  background: global.user.darkMode
                    ? "hsla(240,11%,40%,.5)"
                    : "rgba(200,200,200,.3)",
                },
                p: 2,
                py: 1,
                borderRadius: 2,
                mx: "auto",
                mb: 2,
              },
            }}
          />

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
                  <Icon className="outlined">circle</Icon>
                  <ListItemText
                    primary="Tasks"
                    secondary={!editMode && "Daily goal: 4/7 completed"}
                  />
                </ListItemButton>
              ) : (
                <ListItemButton
                  disableRipple={editMode}
                  onClick={() => !editMode && router.push("/coach")}
                >
                  <Icon className="outlined">favorite</Icon>
                  <ListItemText
                    primary="Daily routine"
                    secondary={!editMode && "7 tasks remaining"}
                  />
                </ListItemButton>
              )
            )}

            <Divider sx={{ my: editMode ? 2 : 1, transition: "all .2s" }} />
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
              <DragOverlay></DragOverlay>
            </DndContext>
          </List>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Chip
              label="Zen mode is in beta"
              sx={{
                background:
                  colors[themeColor][global.user.darkMode ? 900 : "A700"],
                color: !global.user.darkMode ? "#000" : "#fff",
                userSelect: "none",
              }}
            />
          </Box>
        </Box>
        <Toolbar />
      </div>
    </>
  );
}
