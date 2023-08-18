import EmojiPicker from "@/components/EmojiPicker";
import { FileDropInput } from "@/components/FileDrop";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { vibrate } from "@/lib/client/vibration";
import {
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  cloneElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import SelectDateModal from "../DatePicker";
import ChipBar from "./ChipBar";

const MemoizedTextField = memo(TextField);

interface TaskCreationProps {
  children: JSX.Element;
  onSuccess?: () => void;
  closeOnCreate?: boolean;
  defaultDate?: Date | null;
  isSubTask?: boolean;
  parentId?: string;
  boardData?: {
    boardId: string;
    columnId: string;
  };
}

export function CreateTask({
  children,
  onSuccess,
  closeOnCreate = false,
  isSubTask = false,
  boardData,
  parentId,
  defaultDate = dayjs().startOf("day").toDate(),
}: TaskCreationProps) {
  const session = useSession();
  const titleRef: any = useRef();
  const locationRef: any = useRef();
  const descriptionRef: any = useRef();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "grey",
    location: "",
    image: "",
    pinned: false,
    date: defaultDate,
  });

  const [showedFields, setShowedFields] = useState({
    location: false,
    description: false,
  });

  const trigger = cloneElement(children, {
    onClick: () => {
      setOpen(true);
      setTimeout(() => titleRef?.current?.focus(), 50);
    },
  });

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "title"
          ? capitalizeFirstLetter(value.replaceAll("\n", ""))
          : value,
    }));
  }, []);

  const styles = useMemo(
    () => ({
      chip: (active) => ({
        mr: 1,
        px: 1,
        "&, & *, &:hover, &:active": {
          background: palette[active ? 8 : 3] + "!important",
        },
        transition: "none!important",
        "&, & *": {
          color: palette[active ? 12 : 11] + "!important",
        },
      }),
      button: (active) => ({
        background: palette[active ? 5 : 2] + "!important",
        "&:hover": {
          background: { sm: palette[active ? 6 : 3] + "!important" },
        },
        color: palette[active ? 11 : 12] + "!important",
        borderRadius: 3,
        p: 0.5,
        mr: 0.3,
        "& *": {
          transition: "all .2s!important",
          fontVariationSettings:
            '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
        },
        ...(active && {
          "& *": {
            transition: "all .2s!important",
            fontVariationSettings:
              '"FILL" 1, "wght" 350, "GRAD" 0, "opsz" 40!important',
          },
        }),
      }),
    }),
    [palette]
  );

  useEffect(() => {
    if (
      formData.title.includes("!!") ||
      (formData.title === formData.title.toUpperCase() &&
        formData.title.trim().length >= 3)
    ) {
      setFormData((d) => ({ ...d, pinned: true }));
    }
  }, [formData.title]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (closeOnCreate) setOpen(false);
      if (formData.title.trim() === "") return;
      setLoading(true);
      vibrate(50);
      await fetchRawApi(session, "property/boards/column/task/create", {
        ...formData,
        ...(formData.image && { image: JSON.parse(formData.image).url }),
        pinned: formData.pinned ? "true" : "false",
        due: formData.date ? formData.date.toISOString() : "false",
        columnId: -1,
        ...(boardData && { ...boardData }),
        ...(parentId && { parent: parentId }),
      });
      onSuccess && onSuccess();
      toast.dismiss();
      toast.success("Created task!", toastStyles);

      setFormData({
        ...formData,
        title: "",
        description: "",
        pinned: false,
        location: "",
        image: "",
      });
      document.getElementById("title")?.focus();
      setLoading(false);
    },
    [
      closeOnCreate,
      formData,
      session,
      onSuccess,
      boardData,
      setLoading,
      parentId,
    ]
  );

  useHotkeys(
    "alt+a",
    (e) => {
      e.preventDefault();
      document.getElementById("pinTrigger")?.click();
    },
    { enableOnFormTags: true },
    []
  );
  useHotkeys(
    "alt+e",
    (e) => {
      e.preventDefault();
      document.getElementById("emojiTrigger")?.click();
    },
    { enableOnFormTags: true },
    []
  );
  useHotkeys(
    "alt+w",
    (e) => {
      e.preventDefault();
      document.getElementById("fileTrigger")?.click();
    },
    { enableOnFormTags: true },
    []
  );

  useHotkeys(
    "alt+l",
    (e) => {
      e.preventDefault();
      document.getElementById("locationTrigger")?.click();
    },
    { enableOnFormTags: true },
    []
  );
  useHotkeys(
    "alt+d",
    (e) => {
      e.preventDefault();
      document.getElementById("descriptionTrigger")?.click();
    },
    { enableOnFormTags: true },
    []
  );
  useHotkeys(
    "alt+w",
    (e) => {
      e.preventDefault();
      document.getElementById("fileTrigger")?.click();
    },
    { enableOnFormTags: true },
    []
  );
  useHotkeys(
    "alt+s",
    (e) => {
      e.preventDefault();
      document.getElementById("dateTrigger")?.click();
    },
    { enableOnFormTags: true },
    []
  );

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        onClose={() => setOpen(false)}
        open={open}
        onClick={() => titleRef?.current?.focus()}
        PaperProps={{ sx: { background: "transparent", borderRadius: 0 } }}
      >
        <ChipBar
          locationRef={locationRef}
          titleRef={titleRef}
          showedFields={showedFields}
          setShowedFields={setShowedFields}
          data={formData}
          setData={setFormData}
          chipStyles={styles.chip}
          isSubTask={isSubTask}
        />
        <Box
          sx={{
            p: 3,
            pb: 2,
            background: palette[2],
            borderRadius: "20px 20px 0 0",
          }}
        >
          <MemoizedTextField
            autoFocus
            multiline
            placeholder="Task name..."
            variant="standard"
            name="title"
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                handleSubmit(e);
              }
            }}
            inputRef={titleRef}
            value={formData.title}
            onChange={handleInputChange}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: "20px" },
            }}
          />
          <Box
            sx={{
              borderRadius: 5,
              mb: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              "& .MuiAvatar-root": {
                background: palette[3],
                color: palette[9],
              },
            }}
          >
            {showedFields.description && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <MemoizedTextField
                  multiline
                  placeholder="Note"
                  onClick={(e) => e.stopPropagation()}
                  variant="standard"
                  inputRef={descriptionRef}
                  name="description"
                  onKeyDown={(e) => {
                    if (e.code === "Enter" && !e.shiftKey) {
                      handleSubmit(e);
                    }
                  }}
                  value={formData.description}
                  onChange={handleInputChange}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ height: "40px" }}>
                        <Avatar>
                          <Icon className="outlined">sticky_note_2</Icon>
                        </Avatar>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
            )}
            {showedFields.location && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <MemoizedTextField
                  placeholder="Meeting URL or location"
                  variant="standard"
                  onClick={(e) => e.stopPropagation()}
                  name="location"
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  inputRef={locationRef}
                  value={formData.location}
                  onChange={handleInputChange}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ height: "40px" }}>
                        <Avatar>
                          <Icon className="outlined">location_on</Icon>
                        </Avatar>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
            )}
            {formData.image && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <ListItem sx={{ p: 0 }}>
                  <Avatar
                    sx={{ background: palette[5], color: palette[9] }}
                    src={JSON.parse(formData.image).url}
                  />
                  <ListItemText primary="1 attachment" />
                  <IconButton
                    onClick={() => setFormData((s) => ({ ...s, image: "" }))}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                </ListItem>
              </motion.div>
            )}
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              titleRef?.current?.focus();
            }}
          >
            <IconButton
              id="pinTrigger"
              size="small"
              sx={{ ...styles.button(formData.pinned), ml: -0.5 }}
              onClick={() => {
                setFormData((s) => ({ ...s, pinned: !s.pinned }));
              }}
            >
              <Icon
                sx={{
                  ...(formData.pinned && { transform: "rotate(-35deg)" }),
                }}
              >
                push_pin
              </Icon>
            </IconButton>
            <EmojiPicker
              emoji=""
              setEmoji={(s) => {
                setFormData((e) => ({ ...e, title: e.title + s }));
              }}
              useNativeEmoji
            >
              <IconButton
                id="emojiTrigger"
                size="small"
                sx={{
                  ...styles.button(false),
                  display: { xs: "none", sm: "flex" },
                }}
              >
                <Icon>sentiment_satisfied</Icon>
              </IconButton>
            </EmojiPicker>
            <IconButton
              id="locationTrigger"
              size="small"
              sx={styles.button(showedFields.location)}
              onClick={(e) => {
                setShowedFields((s) => ({ ...s, location: !s.location }));
                setTimeout(() => locationRef?.current?.focus());
              }}
            >
              <Icon>location_on</Icon>
            </IconButton>
            <IconButton
              id="descriptionTrigger"
              size="small"
              sx={styles.button(showedFields.description)}
              onClick={() => {
                setShowedFields((s) => ({ ...s, description: !s.description }));
                setTimeout(() => descriptionRef?.current?.focus());
              }}
            >
              <Icon>sticky_note_2</Icon>
            </IconButton>
            <FileDropInput
              onError={() => toast.error("Couldn't upload")}
              onSuccess={(res) => {
                setFormData((s) => ({
                  ...s,
                  image: JSON.stringify(res.data),
                }));
              }}
              onUploadStart={() => {}}
            >
              <IconButton
                size="small"
                sx={styles.button(formData.image)}
                id="fileTrigger"
              >
                <Icon>attach_file</Icon>
              </IconButton>
            </FileDropInput>
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <AnimatePresence>
                <SelectDateModal
                  styles={() => {}}
                  date={formData.date}
                  setDate={(date) => setFormData((s) => ({ ...s, date }))}
                >
                  <Tooltip
                    title={
                      formData.date && (
                        <Box>
                          <Typography>
                            <b>{dayjs(formData.date).format("dddd, MMMM D")}</b>
                          </Typography>
                          {dayjs(formData.date).format("HHmm") !== "0000" && (
                            <Typography variant="body2">
                              {dayjs(formData.date).format("h:mm A")}
                            </Typography>
                          )}
                        </Box>
                      )
                    }
                  >
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 1000,
                        damping: 20,
                      }}
                      key={formData.date && formData.date.toISOString()}
                    >
                      <Button
                        disableRipple
                        id="dateTrigger"
                        variant={!formData.date ? undefined : "contained"}
                        sx={{ px: 2, minWidth: "unset" }}
                      >
                        <Icon>today</Icon>
                      </Button>
                    </motion.div>
                  </Tooltip>
                </SelectDateModal>
              </AnimatePresence>
              <Button
                disableRipple
                variant="contained"
                disabled={loading || formData.title.trim() === ""}
                onClick={handleSubmit}
                sx={{ px: 2, minWidth: "unset" }}
              >
                <Icon>arrow_upward</Icon>
              </Button>
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
