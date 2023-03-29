import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Chip,
  Collapse,
  Grow,
  Icon,
  IconButton,
  ListItemButton,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { capitalizeFirstLetter } from "../../../../../../lib/client/capitalizeFirstLetter";
import { useAccountStorage } from "../../../../../../lib/client/useAccountStorage";
import { fetchRawApi } from "../../../../../../lib/client/useApi";
import { useSession } from "../../../../../../lib/client/useSession";
import { toastStyles } from "../../../../../../lib/client/useTheme";
import { colors } from "../../../../../../lib/colors";
import { EmojiPicker } from "../../../../../EmojiPicker";
import { SelectDateModal } from "../SelectDateModal";
import { ImageModal } from "./ImageModal";

export function CreateTask({
  label = false,
  placeholder = false,
  defaultDate = false,
  parent = false,
  mutationUrl,
  boardId,
  column,
}: any) {
  const session = useSession();
  const storage = useAccountStorage();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pinned, setPinned] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [date, setDate] = useState<any>(
    new Date(defaultDate || new Date().toISOString()) || new Date()
  );
  const deferredDate = useDeferredValue(date);
  const deferredTitle = useDeferredValue(title);

  const trigger = useMediaQuery("(min-width: 600px)");
  const titleRef = useRef<HTMLInputElement>(null);
  const dateModalButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  useHotkeys(
    "alt+s",
    (e) => {
      if (open) {
        e.preventDefault();
        document.getElementById("imageAttachment")?.click();
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open]
  );

  useHotkeys(
    "alt+d",
    (e) => {
      if (open) {
        e.preventDefault();
        setShowDescription(!showDescription);
        setTimeout(() => {
          if (!showDescription) {
            descriptionRef.current?.focus();
            descriptionRef.current?.select();
          } else {
            titleRef.current?.focus();
          }
        }, 50);
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open, showDescription, setShowDescription, descriptionRef, titleRef]
  );

  useHotkeys(
    "alt+a",
    (e) => {
      if (open) {
        e.preventDefault();
        setPinned(!pinned);
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open, pinned]
  );

  useHotkeys(
    "alt+f",
    (e) => {
      if (open) {
        e.preventDefault();
        document.getElementById("dateModal")?.click();
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open]
  );

  const styles = {
    color: `hsl(240,11%,${session.user.darkMode ? 90 : 30}%)`,
    "&:hover": {
      color: session.user.darkMode ? "#fff" : "#000",
    },
    borderRadius: 3,
    transition: "none",
  };

  useEffect(() => {
    if (
      deferredTitle.includes("!!") ||
      (deferredTitle === deferredTitle.toUpperCase() &&
        deferredTitle.trim().length >= 3)
    ) {
      setPinned(true);
    }
    if (deferredTitle.toLowerCase().includes("today")) {
      setDate(new Date());
    } else if (
      [" tomorrow", " tmrw", " tmr", " tmw"].some((keyword) =>
        deferredTitle.toLowerCase().includes(keyword)
      )
    ) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow);
      setTitle((title) =>
        title
          .replace(" tomorrow", " ")
          .replace(" tmrw", " ")
          .replace(" tmr", " ")
          .replace(" tmw", " ")
      );
    } else if (deferredTitle.toLowerCase().includes("next week")) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDate(nextWeek);
    } else if (deferredTitle.toLowerCase().includes("next month")) {
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      setDate(nextMonth);
    }
  }, [deferredTitle]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (deferredTitle.trim() === "") {
        toast.error("You can't have an empty task... 🤦", toastStyles);
        return;
      }
      navigator.vibrate(50);
      setLoading(true);
      fetchRawApi("property/boards/column/task/create", {
        title: deferredTitle,
        description,
        ...(image && { image: JSON.parse(image).url }),
        date,
        pinned: pinned ? "true" : "false",
        due: date ? date.toISOString() : "false",
        ...(parent && { parent }),

        boardId,
        columnId: (column || { id: -1 }).id,
      }).then(() => {
        mutate(mutationUrl);
      });
      toast.success("Created task!", toastStyles);

      setLoading(false);
      setTitle("");
      setDescription("");
      setImage(null);
      setPinned(false);
      titleRef.current?.focus();
    },
    [
      boardId,
      column,
      date,
      description,
      image,
      mutationUrl,
      parent,
      pinned,
      deferredTitle,
    ]
  );

  const chipStyles = (condition: boolean) => {
    return {
      border: "1px solid",
      cursor: "unset!important",
      borderColor: session.user.darkMode
        ? "hsl(240, 11%, 25%)"
        : "rgba(200,200,200,.5)",
      background: session.user.darkMode ? "hsl(240,11%,20%)" : "#fff",
      "&:hover": {
        background: session.user.darkMode ? "hsl(240,11%,23%)" : "#eee ",
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
        background:
          colors[session?.themeColor || "grey"]["A200"] + "!important",
        color: "#000 !important",
        "& *": {
          color: "#000 !important",
        },
      }),
    };
  };

  useEffect(() => {
    setTimeout(() => {
      if (open) {
        titleRef.current?.select();
        titleRef.current?.focus();
      }
      titleRef.current?.focus();
    }, 100);
  }, [open, titleRef]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin()]
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
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            maxWidth: "600px",
            mb: { sm: 5 },
            border: "0!important",
            background: "transparent!important",
            borderRadius: 0,
            mx: "auto",
          },
        }}
      >
        <Box
          sx={{
            mb: 2,
            overflowX: "scroll",
            whiteSpace: "nowrap",
          }}
          ref={emblaRef}
          onClick={() => titleRef.current?.focus()}
        >
          <div>
            <Chip
              label="Important"
              sx={{
                ...chipStyles(pinned),
                ml: { xs: 1, sm: 0.3 },
              }}
              icon={<Icon>priority</Icon>}
              onClick={() => navigator.vibrate(50) && setPinned(!pinned)}
            />
            <Chip
              label="Today"
              sx={chipStyles(
                dayjs(deferredDate.toISOString())
                  .startOf("day")
                  .toISOString() == dayjs().startOf("day").toISOString()
              )}
              icon={<Icon>today</Icon>}
              onClick={() => navigator.vibrate(50) && setDate(new Date())}
            />
            <Chip
              label="Tomorrow"
              sx={chipStyles(
                dayjs(deferredDate.toISOString())
                  .startOf("day")
                  .toISOString() ==
                  dayjs().startOf("day").add(1, "day").toISOString()
              )}
              icon={<Icon>today</Icon>}
              onClick={() => {
                navigator.vibrate(50);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setDate(tomorrow);
              }}
            />
            <Chip
              label="In one month"
              sx={chipStyles(
                dayjs(deferredDate.toISOString())
                  .startOf("day")
                  .toISOString() ==
                  dayjs().startOf("day").add(30, "day").toISOString()
              )}
              icon={<Icon>today</Icon>}
              onClick={() => {
                navigator.vibrate(50);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 30);
                setDate(tomorrow);
              }}
            />
            <Chip
              label="In one year"
              sx={{
                ...chipStyles(
                  dayjs(deferredDate.toISOString())
                    .startOf("day")
                    .toISOString() ==
                    dayjs().startOf("day").add(365, "day").toISOString()
                ),
                mr: { xs: 1, sm: 3 },
              }}
              icon={<Icon>today</Icon>}
              onClick={() => {
                navigator.vibrate(50);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 365);
                setDate(tomorrow);
              }}
            />
          </div>
        </Box>
        <Box
          sx={{
            p: 3,
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            background: session.user.darkMode ? "hsl(240,11%,15%)" : "#fff",
            border: { sm: "1px solid" },
            borderColor: {
              sm: session.user.darkMode
                ? "hsl(240, 11%, 25%)"
                : "rgba(200,200,200,.5)",
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
                    src={JSON.parse(image).url}
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
                if (e.target.value.length == 1) {
                  setTitle(
                    capitalizeFirstLetter(e.target.value.replace(/\n/g, ""))
                  );
                } else {
                  setTitle(e.target.value.replace(/\n/g, ""));
                }
              }}
              autoFocus
              variant="standard"
              onKeyDown={(e) => {
                if (e.key == "Enter") handleSubmit(e);
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
                placeholder="Add description..."
                onKeyDown={(e) => {
                  if (e.key == "Enter" && e.ctrlKey) handleSubmit(e);
                }}
                multiline
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 15, mt: 0.5, mb: 1 },
                }}
              />
            </Collapse>
            <Box sx={{ display: "flex", mt: 1, mb: -1, alignItems: "center" }}>
              <Tooltip title="Mark as important (alt • a)" placement="top">
                <IconButton
                  onClick={() => {
                    navigator.vibrate(50);
                    setPinned(!pinned);
                    titleRef.current?.focus();
                  }}
                  sx={{
                    ...styles,
                    background: pinned
                      ? session.user.darkMode
                        ? "hsl(240,11%,20%)"
                        : "#ddd !important"
                      : "",
                  }}
                  size="small"
                >
                  <Icon className={pinned ? "rounded" : "outlined"}>
                    priority
                  </Icon>
                </IconButton>
              </Tooltip>
              <ImageModal styles={styles} image={image} setImage={setImage} />
              <Tooltip title="Insert emoji (alt • e)" placement="top">
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
                    onClick={() => {
                      navigator.vibrate(50);
                    }}
                    sx={styles}
                    size="small"
                  >
                    <Icon className="outlined">mood</Icon>
                  </IconButton>
                </EmojiPicker>
              </Tooltip>
              <Tooltip title="Description (alt • d)" placement="top">
                <IconButton
                  onClick={() => {
                    navigator.vibrate(50);
                    setShowDescription(!showDescription);
                    setTimeout(() => {
                      {
                        if (!showDescription)
                          document.getElementById("description")?.focus();
                        else document.getElementById("title")?.focus();
                      }
                    }, 100);
                  }}
                  sx={{
                    ...styles,
                    mx: 0.5,
                    background: showDescription
                      ? session.user.darkMode
                        ? "hsl(240,11%,20%)"
                        : "#ddd !important"
                      : "",
                  }}
                  size="small"
                >
                  <Icon>notes</Icon>
                </IconButton>
              </Tooltip>
              <Box
                sx={{
                  ml: "auto",
                  display: "flex",
                  gap: 2,
                  mt: 0,
                  alignItems: "center",
                }}
              >
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
                        color: session.user.darkMode ? "#fff" : "#000",
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
        disabled={storage?.isReached === true}
        id="createTask"
        disableRipple
        className="createTask"
        sx={{
          color: `hsl(240, 11%, ${session.user.darkMode ? 90 : 40}%)`,
          fontWeight: 700,
          borderRadius: { xs: 0, sm: 3 },
          borderBottom: { xs: "1px solid", sm: "none" },
          borderColor: `hsl(240, 11%, ${
            session.user.darkMode ? 15 : 95
          }%) !important`,
          transition: "none",
          gap: 1.5,
          py: { xs: 2, sm: 1.5 },
          px: { xs: 2.5, sm: 1.5 },
          mt: { xs: label ? -0.5 : 0, sm: label ? 0 : 2 },
          ...(label && { mb: -0.5 }),
          "&:active": {
            background: `hsl(240, 11%, ${
              session.user.darkMode ? 15 : 94
            }%) !important`,
          },
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
            boxShadow: `${`inset 0 0 0 1.5px hsl(240, 11%, ${
              session.user.darkMode ? 60 : 40
            }%)`}`,
            borderRadius: "10px",
            display: "flex",
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
              color: `hsl(240, 11%, ${session.user.darkMode ? 60 : 40}%)`,
              fontSize: "21px",
              fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 200, 'opsz' 20!important",
            }}
          >
            add
          </Icon>
        </Box>

        <Typography sx={{ fontWeight: 700, ml: 0.5 }}>
          {parent ? "New subtask" : label || "New list item"}
        </Typography>
      </ListItemButton>
    </>
  );
}
