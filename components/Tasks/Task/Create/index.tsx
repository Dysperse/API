import { Puller } from "@/components/Puller";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { vibrate } from "@/lib/client/vibration";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Chip,
  Collapse,
  Grow,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
  colors,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { motion } from "framer-motion";
import React, {
  cloneElement,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import EmojiPicker from "../../../EmojiPicker";
import { SelectionContext } from "../../Layout";
import { SelectDateModal } from "../DatePicker";
import { ImageModal } from "./ImageModal";

const TaskColorPicker = React.memo(function TaskColorPicker({
  children,
  color,
  setColor,
}: any) {
  const [open, setOpen] = useState(false);
  const trigger = cloneElement(children, {
    onClick: () => setOpen(true),
  });
  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 2, pt: 0 }}>
          {[
            "grey",
            "orange",
            "red",
            "pink",
            "purple",
            "indigo",
            "teal",
            "green",
          ].map((colorChoice) => (
            <ListItemButton
              key={colorChoice}
              selected={color === colorChoice}
              onClick={() => {
                setColor(colorChoice);
                setOpen(false);
              }}
            >
              <Box
                sx={{
                  background: colors[colorChoice][500],
                  width: 15,
                  height: 15,
                  borderRadius: 999,
                }}
              />
              <ListItemText
                primary={capitalizeFirstLetter(
                  colorChoice.replace("grey", "gray"),
                )}
              />
              {color === colorChoice && <Icon sx={{ ml: "auto" }}>check</Icon>}
            </ListItemButton>
          ))}
        </Box>
      </SwipeableDrawer>
    </>
  );
});

export const taskButtonStyles = (palette) => ({
  color: palette[12],
  fontWeight: 700,
  borderRadius: { xs: 0, sm: 3 },
  transition: "none",
  gap: 1.5,
  "&:active": {
    background: {
      xs: `${palette[2]} !important`,
      sm: `${palette[3]} !important`,
    },
  },
  "&:focus-within, &:hover": {
    background: {
      sm: `${palette[3]} !important`,
    },
  },
  py: { xs: 2, sm: 1.5 },
  px: { xs: 2.5, sm: 1.5 },
});

export const CreateTask = React.memo(function CreateTask({
  isSubTask = false,
  sx = {},
  closeOnCreate = false,
  label = false,
  placeholder = false,
  defaultDate = false,
  parent = false,
  mutationUrl = "",
  boardId,
  column,
}: any) {
  const session = useSession();
  const storage = useAccountStorage();
  const emojiRef: any = useRef(null);
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const selection = useContext(SelectionContext);

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("grey");
  const [pinned, setPinned] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const [location, setLocation] = useState<string | null>(null);
  const [showLocation, setShowLocation] = useState<boolean>(false);

  const [date, setDate] = useState<any>(
    new Date(defaultDate || new Date().toISOString()) || new Date(),
  );

  const deferredDate = useDeferredValue(date);
  const deferredTitle = useDeferredValue(title);

  const trigger = useMediaQuery("(min-width: 600px)");
  const titleRef = useRef<HTMLInputElement>(null);
  const dateModalButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  useBackButton(() => setOpen(false));

  const styles = (palette, active) => ({
    color: palette[12],
    ...(active && {
      background: palette[4] + "!important",
      color: palette[11] + "!important",
    }),
    "&:hover": {
      background: palette[4] + "!important",
    },
    cursor: "default",
    borderRadius: 3,
    transition: "none",
  });

  useEffect(() => {
    if (
      deferredTitle.includes("!!") ||
      (deferredTitle === deferredTitle.toUpperCase() &&
        deferredTitle.trim().length >= 3)
    ) {
      setPinned(true);
    }
  }, [deferredTitle]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (closeOnCreate) {
        setOpen(false);
      }
      if (deferredTitle.trim() === "") {
        toast.error("You can't have an empty task... 🤦", toastStyles);
        return;
      }
      vibrate(50);
      setLoading(true);
      fetchRawApi(session, "property/boards/column/task/create", {
        title: deferredTitle,
        description,
        ...(location && { location }),
        ...(image && { image: JSON.parse(image).url }),
        date,
        pinned: pinned ? "true" : "false",
        due: date ? date.toISOString() : "false",
        ...(parent && { parent }),
        boardId,
        color,
        columnId: (column || { id: -1 }).id,
      });
      toast.dismiss();
      toast.success("Created task!", toastStyles);

      setLoading(false);
      setTitle("");
      setDescription("");
      setLocation("");
      setImage(null);
      setPinned(false);
      titleRef.current?.focus();
    },
    [
      boardId,
      closeOnCreate,
      column,
      date,
      description,
      location,
      image,
      parent,
      pinned,
      deferredTitle,
      session,
    ],
  );

  const toggleDescription = () => {
    vibrate(50);
    setShowDescription(!showDescription);
    setTimeout(() => {
      if (!showDescription) document.getElementById("description")?.focus();
      else document.getElementById("title")?.focus();
    }, 100);
  };

  const toggleLocation = () => {
    vibrate(50);
    setShowLocation(!showLocation);
    setTimeout(() => {
      if (!showLocation) document.getElementById("location")?.focus();
      else document.getElementById("title")?.focus();
    }, 100);
  };

  const togglePin = () => {
    vibrate(50);
    setPinned(!pinned);
    titleRef.current?.focus();
  };

  const chipStyles = useCallback(
    (condition: boolean) => {
      return {
        border: "1px solid",
        borderColor: palette[4],
        background: palette[3],
        "&:hover": {
          borderColor: palette[5],
          background: palette[4],
        },
        transition: "transform .2s",
        "&:active": {
          transition: "none",
          transform: "scale(.95)",
        },
        boxShadow: "none!important",
        px: 1,
        mr: 1,
        fontWeight: 600,
        ...(condition && {
          background: palette[8] + "!important",
          borderColor: palette[8] + "!important",
          color: "#000 !important",
          "& *": {
            color: "#000 !important",
          },
        }),
      };
    },
    [palette],
  );

  useEffect(() => {
    setTimeout(() => {
      if (open) {
        titleRef.current?.select();
        titleRef.current?.focus();
      }
      titleRef.current?.focus();
    }, 100);
  }, [open, titleRef]);

  const [emblaRef] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin() as any],
  );

  const generateChipLabel = useCallback(
    (inputString) => {
      const regex = /(?:at|from|during)\s(\d+)/i;
      const match = inputString.match(regex);

      if (match) {
        const time = match[1];
        const amPm = inputString.includes("am") ? "am" : "pm";

        if (Number(time) > 12) return null;

        return (
          <motion.div
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Chip
              label={`${time} ${amPm}`}
              icon={<Icon>access_time</Icon>}
              onClick={() =>
                setDate(
                  dayjs(deferredDate).hour(
                    Number(time) + (amPm === "pm" && time !== "12" ? 12 : 0),
                  ),
                )
              }
              sx={chipStyles(
                dayjs(deferredDate).hour() ===
                  Number(time) + (amPm === "pm" && time !== "12" ? 12 : 0),
              )}
            />
          </motion.div>
        );
      }

      return null;
    },
    [chipStyles, deferredDate],
  );

  const [chipComponent, setChipComponent] = useState<any>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const chip = generateChipLabel(deferredTitle);
      setChipComponent(chip);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [deferredTitle, generateChipLabel]);

  useHotkeys(
    "alt+a",
    (e) => {
      if (open) {
        e.preventDefault();
        setPinned(!pinned);
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open, pinned],
  );

  useHotkeys(
    "alt+s",
    (e) => {
      if (open) {
        e.preventDefault();
        document.getElementById("imageAttachment")?.click();
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open],
  );

  useHotkeys(
    "alt+d",
    (e) => {
      if (open) {
        e.preventDefault();
        emojiRef.current?.click();
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open, emojiRef],
  );

  useHotkeys(
    "alt+f",
    (e) => {
      if (open) {
        e.preventDefault();
        toggleLocation();
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open, toggleLocation],
  );
  useHotkeys(
    "alt+g",
    (e) => {
      if (open) {
        e.preventDefault();
        toggleDescription();
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open, toggleDescription],
  );

  useHotkeys(
    "alt+h",
    (e) => {
      if (open) {
        e.preventDefault();
        document.getElementById("dateModal")?.click();
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open],
  );

  return (
    <>
      <SwipeableDrawer
        {...(trigger && {
          TransitionComponent: Grow,
        })}
        anchor="bottom"
        open={open}
        onClose={() => {
          setOpen(false);
          mutate(mutationUrl);
        }}
        PaperProps={{
          sx: {
            maxWidth: "600px",
            mb: { sm: 5 },
            border: "0!important",
            background: "transparent!important",
            borderRadius: 0,
            maxHeight: "calc(100vh - 100px)",
            mx: "auto",
          },
        }}
      >
        {!isSubTask && (
          <Box
            sx={{
              mb: 2,
              pl: { xs: 1, sm: 0 },
              overflowX: "scroll",
              overflowY: "visible",
              whiteSpace: "nowrap",
            }}
            ref={emblaRef}
            onClick={() => titleRef.current?.focus()}
          >
            <div>
              {chipComponent}
              {[
                "meet",
                "visit",
                "watch",
                "go to",
                "drive ",
                "fly ",
                "attend ",
              ].some((word) => deferredTitle.toLowerCase().includes(word)) && (
                <motion.div
                  style={{ display: "inline-block" }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Chip
                    label="Add location?"
                    icon={<Icon>location_on</Icon>}
                    onClick={toggleLocation}
                    sx={chipStyles(showLocation)}
                  />
                </motion.div>
              )}
              {[
                { label: "Today", days: 0 },
                { label: "Tomorrow", days: 1 },
                { label: "In a week", days: 7 },
                { label: "In 2 weeks", days: 14 },
                { label: "In a month", days: 30 },
              ].map(({ label, days }) => {
                const isActive =
                  deferredDate &&
                  dayjs(deferredDate.toISOString())
                    .startOf("day")
                    .toISOString() ==
                    dayjs().startOf("day").add(days, "day").toISOString();

                return (
                  <Chip
                    key={label}
                    label={label}
                    sx={chipStyles(isActive)}
                    icon={<Icon>today</Icon>}
                    onClick={() => {
                      vibrate(50);
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + days);
                      tomorrow.setHours(0);
                      tomorrow.setMinutes(0);
                      tomorrow.setSeconds(0);
                      setDate(tomorrow);
                    }}
                  />
                );
              })}
            </div>
          </Box>
        )}
        <Box
          sx={{
            p: 3,
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            background: palette[2],
            border: { sm: "1px solid" },
            borderColor: {
              sm: palette[3],
            },
          }}
        >
          <form onSubmit={handleSubmit}>
            {image && (
              <Box
                sx={{
                  width: 300,
                  position: "relative",
                  borderRadius: 5,
                  overflow: "hidden",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  mb: 2,
                  height: 200,
                }}
              >
                <picture>
                  <img
                    alt="Uploaded"
                    width="100%"
                    height="100%"
                    draggable={false}
                    src={JSON.parse(image).display_url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </picture>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 0,
                    m: 1,
                    right: 0,
                    background: "rgba(0,0,0,0.7)!important",
                    color: "#fff!important",
                    minWidth: "unset",
                    borderRadius: 999,
                    zIndex: 999,
                  }}
                  onClick={() => setImage(null)}
                >
                  <Icon className="outlined" sx={{ fontSize: "20px" }}>
                    delete
                  </Icon>
                </IconButton>
              </Box>
            )}
            <TextField
              multiline
              inputRef={titleRef}
              id="title"
              value={title}
              onChange={(e) => {
                if (e.target.value.length === 1) {
                  setTitle(
                    capitalizeFirstLetter(e.target.value.replace(/\n/g, "")),
                  );
                } else {
                  setTitle(e.target.value.replace(/\n/g, ""));
                }
              }}
              autoFocus
              variant="standard"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              placeholder={
                placeholder
                  ? placeholder
                  : 'Add an item to "' +
                    (column || { name: "this task" }).name +
                    '"'
              }
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 19 },
              }}
            />
            <Collapse in={showDescription}>
              <TextField
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                inputRef={descriptionRef}
                variant="standard"
                placeholder="Add note..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleSubmit(e);
                }}
                multiline
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 15 },
                }}
              />
            </Collapse>
            <Collapse in={showLocation}>
              <TextField
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                inputRef={descriptionRef}
                variant="standard"
                placeholder="Add location..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleSubmit(e);
                }}
                multiline
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 15 },
                }}
              />
            </Collapse>
            <Box sx={{ display: "flex", mt: 1, mb: -1, alignItems: "center" }}>
              <Tooltip
                title={`${pinned ? "Unpin" : "Pin"} (alt • a)`}
                placement="top"
              >
                <IconButton
                  onClick={togglePin}
                  sx={styles(palette, pinned)}
                  size="small"
                >
                  <Icon
                    className={pinned ? "rounded" : "outlined"}
                    sx={{
                      ...(pinned && { transform: "rotate(-40deg)" }),
                      transition: "all .2s",
                    }}
                  >
                    push_pin
                  </Icon>
                </IconButton>
              </Tooltip>
              <ImageModal styles={styles} image={image} setImage={setImage} />
              <Tooltip title="Emoji (alt • d)" placement="top">
                <div>
                  <EmojiPicker
                    emoji={""}
                    useNativeEmoji
                    setEmoji={(emoji) => {
                      setTitle((t) => t + emoji);
                      setTimeout(() => {
                        const input: any = titleRef.current;
                        titleRef.current?.focus();
                        input.selectionStart = input.selectionEnd =
                          input.value.length;
                      }, 100);
                    }}
                  >
                    <IconButton
                      onClick={() => vibrate(50)}
                      ref={emojiRef}
                      sx={{
                        ...styles(palette, false),
                        display: { xs: "none", sm: "flex" },
                      }}
                      size="small"
                    >
                      <Icon className="outlined">mood</Icon>
                    </IconButton>
                  </EmojiPicker>
                </div>
              </Tooltip>
              <Tooltip title="Location (alt • f)" placement="top">
                <IconButton
                  onClick={toggleLocation}
                  sx={styles(palette, showLocation)}
                  size="small"
                >
                  <Icon {...(!showLocation && { className: "outlined" })}>
                    location_on
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Note (alt • g)" placement="top">
                <IconButton
                  onClick={toggleDescription}
                  sx={{
                    mx: 0.5,
                    ...styles(palette, showDescription),
                  }}
                  size="small"
                >
                  <Icon {...(!showDescription && { className: "outlined" })}>
                    sticky_note_2
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title={`Color (alt • h)`} placement="top">
                <TaskColorPicker color={color} setColor={setColor}>
                  <IconButton
                    sx={{
                      ...styles(palette, false),
                      ...(color !== "grey" && {
                        background: colors[color][900],
                        color: colors[color][100],
                      }),
                    }}
                    size="small"
                  >
                    <Icon className={color === "grey" ? "outlined" : ""}>
                      label
                    </Icon>
                  </IconButton>
                </TaskColorPicker>
              </Tooltip>
              {!isSubTask && (
                <SelectDateModal
                  ref={dateModalButtonRef}
                  styles={styles}
                  date={date}
                  setDate={(e) => {
                    setDate(e);
                    setTimeout(() => {
                      titleRef.current?.focus();
                    }, 100);
                  }}
                />
              )}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 0,
                  alignItems: "center",
                  ...(isSubTask && { ml: "auto" }),
                }}
              >
                <div>
                  <LoadingButton
                    loading={loading}
                    disabled={
                      deferredTitle.trim() === "" || deferredTitle.length > 200
                    }
                    type="submit"
                    disableRipple
                    color="inherit"
                    sx={{
                      ...(deferredTitle.trim() !== "" && {
                        color: isDark ? "#fff" : "#000",
                      }),
                      "&:active": {
                        transform: "scale(.95)",
                        transition: "none",
                        opacity: ".6",
                      },
                      transition: "all .2s",
                      borderRadius: 5,
                      px: 2,
                      minWidth: "auto",
                    }}
                    variant="contained"
                  >
                    <Icon>add</Icon>
                  </LoadingButton>
                </div>
              </Box>
            </Box>
          </form>
        </Box>
      </SwipeableDrawer>
      <ListItemButton
        disabled={
          storage?.isReached === true ||
          session?.permission === "read-only" ||
          selection?.values?.length > 0
        }
        disableRipple
        id="createTask"
        className="cursor-unset"
        sx={{
          ...taskButtonStyles(palette),
          mt: { xs: label ? -0.5 : 0, sm: label ? 0 : 2 },
          ...(label && { mb: -0.5 }),
          ...sx,
        }}
        onClick={() => {
          setOpen(true);
          if (defaultDate) {
            setDate(defaultDate);
          }
          setTimeout(() => {
            titleRef.current?.focus();
          }, 100);
        }}
      >
        <Box
          sx={{
            boxShadow: `${`inset 0 0 0 1.5px ${palette[12]}`}`,
            borderRadius: "10px",
            display: "flex",
            opacity: 0.5,
            width: 25,
            height: 25,
            ml: 0.3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            className="outlined"
            style={{
              color: palette[12],
              fontSize: "21px",
              fontVariationSettings:
                "'FILL' 1, 'wght' 500, 'GRAD' 200, 'opsz' 20!important",
            }}
          >
            add
          </Icon>
        </Box>

        <Typography sx={{ ml: 0.5, fontWeight: 400 }}>
          {parent ? "New subtask" : label || "New list item"}
        </Typography>
      </ListItemButton>
    </>
  );
});
