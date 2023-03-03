import LoadingButton from "@mui/lab/LoadingButton";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";
import { SelectDateModal } from "./SelectDateModal";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { toastStyles } from "../../../../../lib/useCustomTheme";
import { useAccountStorage, useSession } from "../../../../../pages/_app";
import { capitalizeFirstLetter } from "../../../../ItemPopup";

function ImageModal({ image, setImage, styles }) {
  const [imageUploading, setImageUploading] = useState(false);
  const session = useSession();

  return (
    <>
      <Tooltip title="Attach an image (alt • s)" placement="top">
        <IconButton
          onClick={() => {
            navigator.vibrate(50);
            document.getElementById("imageAttachment")?.click();
          }}
          sx={{
            ...styles,
            mx: 0.5,
            background: image
              ? session?.user?.darkMode
                ? "hsl(240,11%,20%)"
                : "#ddd !important"
              : "",
          }}
          size="small"
        >
          {imageUploading ? (
            <CircularProgress size={20} sx={{ mx: 0.5 }} />
          ) : (
            <span
              className={
                image ? "material-symbols-rounded" : "material-symbols-outlined"
              }
            >
              image
            </span>
          )}
        </IconButton>
      </Tooltip>
      <input
        type="file"
        id="imageAttachment"
        name="imageAttachment"
        style={{
          display: "none",
        }}
        onChange={async (e: any) => {
          const key = "da1f275ffca5b40715ac3a44aa77cf42";
          const form = new FormData();
          form.append("image", e.target.files[0]);

          setImageUploading(true);
          fetch(`https://api.imgbb.com/1/upload?name=image&key=${key}`, {
            method: "POST",
            body: form,
          })
            .then((res) => res.json())
            .then((res) => {
              setImage(res.data);
              setImageUploading(false);
            })
            .catch((err) => {
              setImageUploading(false);
            });
        }}
        accept="image/png, image/jpeg"
      />
    </>
  );
}

export function CreateTask({
  label = false,
  placeholder = false,
  defaultDate = false,
  parent = false,
  mutationUrl,
  boardId,
  column,
  checkList = false,
}: any) {
  const storage = useAccountStorage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<any>(
    new Date(defaultDate || new Date().toISOString()) || new Date()
  );
  const [pinned, setPinned] = useState(false);
  const [image, setImage] = useState<any>(null);

  const [showDescription, setShowDescription] = useState(false);

  useHotkeys(
    "alt+s",
    (e) => {
      if (open) {
        e.preventDefault();
        document.getElementById("imageAttachment")?.click();
      }
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA"],
    }
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
            // titleRef.current?.select();
          }
        }, 50);
      }
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA"],
    }
  );

  useHotkeys(
    "alt+a",
    (e) => {
      if (open) {
        e.preventDefault();
        setPinned(!pinned);
      }
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA"],
    }
  );

  useHotkeys(
    "alt+f",
    (e) => {
      if (open) {
        e.preventDefault();
        document.getElementById("dateModal")?.click();
      }
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA"],
    }
  );

  const session = useSession();

  const styles = {
    color: session?.user?.darkMode ? "hsl(240,11%,90%)" : "#505050",
    "&:hover": {
      color: session?.user?.darkMode ? "#fff" : "#000",
    },
    borderRadius: 3,
    transition: "none",
  };

  useEffect(() => {
    if (
      title.includes("!!") ||
      (title === title.toUpperCase() && title.length >= 3)
    ) {
      setPinned(true);
    }
    if (title.toLowerCase().includes("today")) {
      setDate(new Date());
    } else if (
      title.toLowerCase().includes("tomorrow") ||
      title.toLowerCase().includes("tmrw") ||
      title.toLowerCase().includes("tmr") ||
      title.toLowerCase().includes("tmw")
    ) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow);
    } else if (title.toLowerCase().includes("next week")) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDate(nextWeek);
    } else if (title.toLowerCase().includes("next month")) {
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      setDate(nextMonth);
    }
  }, [title]);

  const titleRef = useRef<HTMLInputElement>(null);
  const dateModalButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (title.trim() === "") {
        toast.error("You can't have an empty task... 🤦", toastStyles);
        return;
      }
      navigator.vibrate(50);
      setLoading(true);
      fetchApiWithoutHook("property/boards/column/task/create", {
        title,
        description,
        ...(image && { image: image.url }),
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
      title,
      setTitle,
      description,
      setDescription,
      image,
      setImage,
      pinned,
      setPinned,
      boardId,
      column,
      date,
      mutationUrl,
      parent,
    ]
  );

  const chipStyles = {
    border: "1px solid",
    borderColor: session?.user?.darkMode
      ? "hsl(240, 11%, 25%)"
      : "rgba(200,200,200,.5)",
    background: session?.user?.darkMode
      ? "hsl(240,11%,20%)!important"
      : "#fff !important",
    transition: "all .2s",
    "&:active": {
      transition: "none",
      transform: "scale(.95)",
    },
    boxShadow: "none!important",
    px: 1,
    mr: 1,
  };

  useEffect(() => {
    setTimeout(() => {
      if (open) {
        titleRef.current?.select();
      }
      titleRef.current?.focus();
    });
  }, [open, titleRef]);

  const trigger = useMediaQuery("(min-width: 600px)");

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
          onClick={() => titleRef.current?.focus()}
        >
          <Chip
            label="Important"
            sx={{
              ...chipStyles,
              ml: { xs: 1, sm: 0.3 },
              transition: "transform .2s",
              ...(pinned && {
                background:
                  colors[session?.themeColor || "grey"]["900"] + "!important",
                color: "#fff!important",
              }),
            }}
            icon={
              <Icon
                sx={{
                  ...(pinned && {
                    color: "#fff!important",
                  }),
                }}
              >
                priority
              </Icon>
            }
            onClick={() => navigator.vibrate(50) && setPinned(!pinned)}
          />
          <Chip
            label="Today"
            sx={chipStyles}
            icon={<Icon>today</Icon>}
            onClick={() => navigator.vibrate(50) && setDate(new Date())}
          />
          <Chip
            label="Tomorrow"
            sx={chipStyles}
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
            sx={chipStyles}
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
            sx={chipStyles}
            icon={<Icon>today</Icon>}
            onClick={() => {
              navigator.vibrate(50);
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 365);
              setDate(tomorrow);
            }}
          />
        </Box>
        <Box
          sx={{
            p: 3,
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            background: session?.user?.darkMode ? "hsl(240,11%,15%)" : "#fff",
            border: { sm: "1px solid" },
            borderColor: {
              sm: session?.user?.darkMode
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
                    draggable={false}
                    src={image.url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </picture>
                <Button
                  sx={{
                    position: "absolute",
                    top: 0,
                    m: 1,
                    right: 0,
                    background: "rgba(0,0,0,0.7)!important",
                    color: "#fff!important",
                    minWidth: "unset",
                    width: 25,
                    height: 25,
                    borderRadius: 999,
                    zIndex: 999,
                  }}
                  onClick={() => {
                    setImage(null);
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    close
                  </span>
                </Button>
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
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 15, mt: 0.5, mb: 1 },
                }}
              />
            </Collapse>
            {title.toLowerCase().includes("study ") && (
              <Alert
                severity="info"
                sx={{
                  mt: 1,
                  mb: 2,
                  borderRadius: 5,
                  background:
                    colors[session?.themeColor || "grey"][
                      session?.user?.darkMode ? 900 : 100
                    ],
                  color:
                    colors[session?.themeColor || "grey"][
                      !session?.user?.darkMode ? 900 : 100
                    ],
                }}
                icon={
                  <span
                    className="material-symbols-rounded"
                    style={{
                      color:
                        colors[session?.themeColor || "grey"][
                          session?.user?.darkMode ? 100 : 800
                        ],
                    }}
                  >
                    info
                  </span>
                }
              >
                Do you want to create{" "}
                <Link href="/coach" style={{ textDecoration: "underline" }}>
                  goal
                </Link>{" "}
                instead?
              </Alert>
            )}
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
                      ? session?.user?.darkMode
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
                      ? session?.user?.darkMode
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
                    disabled={title.trim() === ""}
                    type="submit"
                    disableRipple
                    color="inherit"
                    sx={{
                      ...(title.trim() !== "" && {
                        color: session?.user?.darkMode ? "#fff" : "#000",
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
        className="task createTask"
        sx={{
          transition: "none",
          color: colors["grey"][session?.user?.darkMode ? "A100" : "A700"],
          p: {
            xs: 1,
            sm: "0!important",
          },
          ...(label && {
            border: { sm: "none!important" },
            borderColor: { sm: "transparent!important" },
            boxShadow: "none!important",
            py: "0!important",
          }),
          cursor: "unset!important",
          ...(session?.user?.darkMode && {
            "&:hover": {
              backgroundColor: "hsl(240,11%,16%)!important",
            },
            "&:active": {
              backgroundColor: "hsl(240,11%,19%)!important",
            },
          }),
          ...(!checkList && {
            boxShadow: {
              sm: "none!important",
            },
            border: {
              sm: "none!important",
            },
          }),
          mt: {
            xs: 1.5,
            sm: checkList ? 1.5 : label ? -1 : 0,
          },
        }}
        onClick={() => {
          setOpen(true);
          if (defaultDate) {
            setDate(defaultDate);
          }
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            border:
              "2px solid " +
              (session?.user?.darkMode ? "hsl(240,11%,70%)" : "#808080"),
            borderRadius: "10px",
            color: session?.user?.darkMode
              ? "hsl(240,11%,90%)"
              : checkList
              ? "#303030"
              : "#808080",
            marginLeft: label ? "10px" : "15px",
            marginRight: label ? "20px" : "5px",
            fontSize: "20px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          add
        </span>

        <Typography sx={{ ml: label ? -1.5 : 0.5 }}>
          {parent ? "New subtask" : label || "New list item"}
        </Typography>
      </ListItemButton>
    </>
  );
}
