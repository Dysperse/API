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
import dynamic from "next/dynamic";
import React, {
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
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
const ChipBar = dynamic(() => import("./ChipBar"), { ssr: false });

export const taskButtonStyles = (palette) => ({
  color: palette[12],
  fontWeight: 700,
  borderRadius: { xs: 0, sm: 3 },
  transition: "none",
  gap: 1.5,
  "&:focus-within, &:hover": {
    background: {
      xs: `transparent !important`,
      sm: `${palette[2]} !important`,
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
  const emojiRef: any = useRef(null);
  const storage = useAccountStorage();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isDark = useDarkMode(session.darkMode);
  const selection = useContext(SelectionContext);
  const palette = useColor(session.themeColor, isDark);

  const [data, setData] = useState<any>({
    title: "",
    color: "grey",
    description: "",
    pinned: false,
    image: "",
    location: "",
    date: new Date(defaultDate || new Date().toISOString()),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLocation, setShowLocation] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const deferredData = useDeferredValue(data);

  const placeholderValue = useMemo(
    () =>
      placeholder
        ? placeholder
        : 'Add an item to "' + (column || { name: "this task" }).name + '"',
    [placeholder, column]
  );

  const titleRef = useRef<HTMLInputElement>(null);
  const trigger = useMediaQuery("(min-width: 600px)");
  const descriptionRef = useRef<HTMLInputElement>(null);
  const dateModalButtonRef = useRef<HTMLButtonElement>(null);

  useBackButton(() => setOpen(false));

  const styles = useMemo(
    () => (palette, active) => ({
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
    }),
    []
  );

  useEffect(() => {
    if (
      deferredData.title.includes("!!") ||
      (deferredData.title === deferredData.title.toUpperCase() &&
        deferredData.title.trim().length >= 3)
    ) {
      setData((d) => ({ ...d, pinned: true }));
    }
  }, [deferredData.title]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (closeOnCreate) setOpen(false);
      if (deferredData.title.trim() === "") return;
      vibrate(50);
      setLoading(true);
      console.log(data);
      fetchRawApi(session, "property/boards/column/task/create", {
        ...data,
        ...(data.image && { image: JSON.parse(data.image).url }),
        pinned: data.pinned ? "true" : "false",
        due: data.date ? data.date.toISOString() : "false",
        boardId,
        columnId: (column || { id: -1 }).id,
        ...(parent && { parent }),
      });
      toast.dismiss();
      toast.success("Created task!", toastStyles);
      setLoading(false);
      setData({
        ...data,
        title: "",
        description: "",
        pinned: false,
        location: "",
        image: "",
      });
      titleRef.current?.focus();
    },
    [boardId, closeOnCreate, column, data, parent, deferredData.title, session]
  );

  const toggleDescription = useCallback(() => {
    vibrate(50);
    setShowDescription((prev) => !prev);
    setTimeout(() => {
      if (!showDescription) descriptionRef.current?.focus();
      else titleRef.current?.focus();
    }, 100);
  }, [descriptionRef, showDescription]);

  const toggleLocation = useCallback(() => {
    vibrate(50);
    setShowLocation((prev) => !prev);
    setTimeout(() => {
      if (!showLocation) descriptionRef.current?.focus();
      else titleRef.current?.focus();
    }, 100);
  }, [descriptionRef, showLocation]);

  const togglePin = useCallback(() => {
    vibrate(50);
    setData((d) => ({ ...d, pinned: !d.pinned }));
    titleRef.current?.focus();
  }, [titleRef]);

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
    [palette]
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

  useHotkeys(
    "alt+a",
    (e) => {
      if (open) {
        e.preventDefault();
        togglePin();
      }
    },
    { enableOnFormTags: ["INPUT", "TEXTAREA"] },
    [open, togglePin]
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
    [open]
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
    [open, emojiRef]
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
    [open, toggleLocation]
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
    [open, toggleDescription]
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
    [open]
  );

  const handleTitleChange = useCallback((e) => {
    if (e.target.value.length === 1) {
      setData((d) => ({
        ...d,
        title: capitalizeFirstLetter(e.target.value.replace(/\n/g, "")),
      }));
    } else {
      setData((d) => ({ ...d, title: e.target.value.replace(/\n/g, "") }));
    }
  }, []);

  return (
    <>
      <ListItemButton
        disabled={
          storage?.isReached === true ||
          session?.permission === "read-only" ||
          selection?.values?.length > 0
        }
        disableRipple
        id="createTask"
        className="item cursor-unset"
        sx={{
          ...taskButtonStyles(palette),
          mt: { xs: label ? -0.5 : 0, sm: label ? 0 : 2 },
          ...(label && { mb: -0.5 }),
          ...sx,
          "&:active": {
            background: {
              xs: palette[2] + "!important",
              sm: palette[3] + "!important",
            },
          },
        }}
        onClick={() => {
          setOpen(true);
          if (defaultDate) {
            setData((d) => ({ ...d, date: defaultDate }));
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
            }}
          >
            add
          </Icon>
        </Box>

        <Typography sx={{ ml: 0.5, fontWeight: 400 }}>
          {parent ? "New subtask" : label || "New list item"}
        </Typography>
      </ListItemButton>

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
            overflow: "visible",
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
          <ChipBar
            chipStyles={chipStyles}
            toggleLocation={toggleLocation}
            showLocation={showLocation}
            titleRef={titleRef}
            data={deferredData}
            setData={setData}
          />
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
            {data.image && (
              <Box
                sx={{
                  width: 300,
                  position: "relative",
                  borderRadius: 5,
                  overflow: "hidden",
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
                    src={JSON.parse(data.image).display_url}
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
                    zIndex: 999,
                  }}
                  onClick={() => setData({ ...data, image: null })}
                >
                  <Icon className="outlined" sx={{ fontSize: "20px" }}>
                    delete
                  </Icon>
                </IconButton>
              </Box>
            )}
            <TextField
              multiline
              autoFocus
              id="title"
              variant="standard"
              value={data.title}
              inputRef={titleRef}
              onChange={handleTitleChange}
              placeholder={placeholderValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 19 },
              }}
            />
            <Collapse in={showDescription}>
              <TextField
                multiline
                id="description"
                variant="standard"
                placeholder="Add note..."
                value={data.description}
                inputRef={descriptionRef}
                InputProps={{ disableUnderline: true }}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleSubmit(e);
                }}
              />
            </Collapse>
            <Collapse in={showLocation}>
              <TextField
                multiline
                id="location"
                variant="standard"
                placeholder="Add location..."
                value={data.location}
                onChange={(e) =>
                  setData((d) => ({ ...d, location: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleSubmit(e);
                }}
                InputProps={{ disableUnderline: true }}
              />
            </Collapse>
            <Box sx={{ display: "flex", mt: 1, mb: -1, alignItems: "center" }}>
              <Tooltip
                title={`${deferredData.pinned ? "Unpin" : "Pin"} (alt • a)`}
                placement="top"
              >
                <IconButton
                  onClick={togglePin}
                  sx={styles(palette, deferredData.pinned)}
                  size="small"
                >
                  <Icon
                    className={deferredData.pinned ? "rounded" : "outlined"}
                    sx={{
                      ...(deferredData.pinned && {
                        transform: "rotate(-40deg)",
                      }),
                      transition: "all .2s",
                    }}
                  >
                    push_pin
                  </Icon>
                </IconButton>
              </Tooltip>

              {!isMobile && (
                <Tooltip title="Emoji (alt • d)" placement="top">
                  <div>
                    <EmojiPicker
                      emoji={""}
                      useNativeEmoji
                      setEmoji={(emoji) => {
                        setData((d) => ({ ...d, title: d.title + emoji }));
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
                        sx={styles(palette, false)}
                        size="small"
                      >
                        <Icon className="outlined">mood</Icon>
                      </IconButton>
                    </EmojiPicker>
                  </div>
                </Tooltip>
              )}
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
                    ml: 0.5,
                    ...styles(palette, showDescription),
                  }}
                  size="small"
                >
                  <Icon {...(!showDescription && { className: "outlined" })}>
                    sticky_note_2
                  </Icon>
                </IconButton>
              </Tooltip>
              <ImageModal
                styles={styles}
                image={deferredData.image}
                imageUploading={imageUploading}
                setImageUploading={setImageUploading}
                setImage={(image) =>
                  setData({ ...data, image: JSON.stringify(image) })
                }
              />
              {!isSubTask && (
                <SelectDateModal
                  ref={dateModalButtonRef}
                  styles={styles}
                  date={deferredData.date}
                  setDate={(e) => {
                    setData((d) => ({ ...d, date: e }));
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
                      deferredData.title.trim() === "" ||
                      deferredData.title.length > 200 ||
                      imageUploading
                    }
                    type="submit"
                    disableRipple
                    color="inherit"
                    sx={{
                      ...(deferredData.title.trim() !== "" && {
                        color: isDark ? "#fff" : "#000",
                      }),
                      "&:active": {
                        opacity: ".6",
                      },
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
    </>
  );
});
