import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Box,
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
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";
import { toastStyles } from "../../../../../lib/useCustomTheme";
import { useAccountStorage, useSession } from "../../../../../pages/_app";
import { capitalizeFirstLetter } from "../../../../ItemPopup";
import { SelectDateModal } from "./SelectDateModal";

function ImageModal({ image, setImage, styles }) {
  const [imageUploading, setImageUploading] = useState<boolean>(false);
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
              setImage(JSON.stringify(res.data));
              console.log("Image uploaded!!!", res.data);
              setImageUploading(false);
            })
            .catch(() => {
              toast.error(
                "Yikes! An error occured while trying to upload your image. Please try again later"
              );
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
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<any>(
    new Date(defaultDate || new Date().toISOString()) || new Date()
  );
  const [pinned, setPinned] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  const [showDescription, setShowDescription] = useState<boolean>(false);

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
      setTitle(title.replace("!!", "").trim());
      setPinned(true);
    }
    if (title.toLowerCase().includes("today")) {
      setDate(new Date());
    } else if (
      title.toLowerCase().includes(" tomorrow") ||
      title.toLowerCase().includes(" tmrw") ||
      title.toLowerCase().includes(" tmr") ||
      title.toLowerCase().includes(" tmw")
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
                  onClick={() => {
                    setImage(null);
                  }}
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
                    disabled={title.trim() === "" || title.length > 200}
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
        disableRipple
        className="createTask"
        sx={{
          ...(!label && { display: { xs: "none", sm: "flex" } }),
          color: `hsl(240, 11%, ${session?.user?.darkMode ? 90 : 40}%)`,
          fontWeight: 700,
          borderRadius: { xs: 0, sm: 3 },
          borderBottom: { xs: "1px solid", sm: "none" },
          borderColor: `hsl(240, 11%, ${
            session?.user?.darkMode ? 20 : 95
          }%) !important`,
          transition: "none",
          py: { xs: 2, sm: 1.5 },
          px: { xs: 2.5, sm: 1.5 },
          gap: 1.5,
          mt: { xs: -0.5, sm: label ? 0 : 2 },
          ...(label && { mb: -0.5 }),
          "&:active": {
            background: `hsl(240, 11%, ${
              session?.user?.darkMode ? 15 : 94
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
              session?.user?.darkMode ? 60 : 40
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
              color: `hsl(240, 11%, ${session?.user?.darkMode ? 60 : 40}%)`,
              fontSize: "21px",
              fontVariationSettings: `'FILL' 1, 'wght' 500, 'GRAD' 200, 'opsz' 20!important`,
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
