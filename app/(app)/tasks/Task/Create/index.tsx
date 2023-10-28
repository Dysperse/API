import EmojiPicker from "@/components/EmojiPicker";
import { FileDropInput } from "@/components/FileDrop";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useBackButton } from "@/lib/client/useBackButton";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Badge,
  Box,
  Icon,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  SxProps,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
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
    columnName: string;
    columnEmoji: string;
  };
  defaultFields?: {
    [key: string]: string | Date | null;
  };
  sx?: SxProps;
  customTrigger?: string;
  disableBadge?: boolean;
}

const ColumnData = memo(function ColumnData({ boardData }: any) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <Box
      sx={{
        px: 3,
        py: 1,
        pb: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: -2,
        background: `linear-gradient(${palette[2]}, ${palette[3]})`,
        borderRadius: "20px 20px 0 0",
      }}
    >
      <img
        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${boardData.columnEmoji}.png`}
        alt=""
        width={35}
      />

      <Typography variant="h6">{boardData.columnName}</Typography>
    </Box>
  );
});

export function CreateTask({
  children,
  onSuccess,
  closeOnCreate = false,
  isSubTask = false,
  boardData,
  parentId,
  defaultDate = dayjs().startOf("day").toDate(),
  defaultFields = {},
  sx = {},
  customTrigger = "onClick",
  disableBadge = false,
}: TaskCreationProps) {
  const { session } = useSession();
  const titleRef: any = useRef();
  const locationRef: any = useRef();
  const descriptionRef: any = useRef();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const isMobile = useMediaQuery("(max-width:600px)");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useBackButton({
    open,
    callback: () => setOpen(false),
    hash: "task/create",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "grey",
    location: "",
    image: "",
    pinned: false,
    date: defaultDate,
    dateOnly: true,
    notifications: [10],
    recurrenceRule: null,
  });

  const [showedFields, setShowedFields] = useState({
    location: false,
    description: false,
  });

  const trigger = cloneElement(children, {
    [customTrigger]: (e) => {
      e.preventDefault();
      setOpen(true);

      // Reset fields
      setFormData((prevFormData) => ({ ...prevFormData, ...defaultFields }));
      if (defaultFields.description) {
        setShowedFields((prevShowedFields) => ({
          ...prevShowedFields,
          description: true,
        }));
      }

      setTimeout(() => titleRef?.current?.focus(), 50);
    },
  });

  const triggerBadge = useMemo(
    () =>
      disableBadge ? (
        trigger
      ) : (
        <Badge
          badgeContent={
            !open &&
            (formData.title !== "" ||
              formData.description !== "" ||
              formData.location !== "")
              ? 1
              : 0
          }
          color="primary"
          variant="dot"
          sx={sx}
        >
          {trigger}
        </Badge>
      ),
    [
      open,
      formData.title,
      sx,
      trigger,
      disableBadge,
      formData.description,
      formData.location,
    ]
  );

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
        "&, &:hover, &:active": {
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
        px: 1,
        py: 0.8,
        mr: 0.3,
        "& *": {
          transition: "all .2s!important",
          fontVariationSettings:
            '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 40!important',
        },
        ...(active && {
          "& *": {
            transition: "all .2s!important",
            fontVariationSettings:
              '"FILL" 1, "wght" 200, "GRAD" 0, "opsz" 40!important',
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
    } else {
      if (formData.title.trim() === "") {
        setFormData((d) => ({ ...d, pinned: false }));
      }
    }
  }, [formData.title]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (closeOnCreate) setOpen(false);
        if (formData.title.trim() === "") return;
        setLoading(true);
        vibrate(50);
        fetchRawApi(session, "property/boards/column/task/create", {
          ...formData,
          ...(formData.image && { image: JSON.parse(formData.image).url }),
          pinned: formData.pinned ? "true" : "false",
          due: formData.date ? formData.date.toISOString() : "false",
          columnId: -1,
          notifications: JSON.stringify(
            formData.notifications.sort().reverse()
          ),
          recurrenceRule: "",
          ...((formData.recurrenceRule && {
            recurrenceRule: (formData.recurrenceRule as any)?.toString(),
          }) as any),
          ...(boardData && { ...boardData }),
          ...(parentId && { parent: parentId }),
          createdBy: session.user.email,
        }).then(() => onSuccess && onSuccess());
        toast.dismiss();
        toast.success("Created task!");

        setFormData({
          ...formData,
          title: "",
          description: "",
          pinned: false,
          location: "",
          image: "",
          recurrenceRule: null,
        });
        setShowedFields({
          description: false,
          location: false,
        });
        document.getElementById("title")?.focus();
        setLoading(false);
      } catch (e) {
        toast.error("Couldn't create task");
      }
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
    { enableOnFormTags: true }
  );
  useHotkeys(
    "alt+e",
    (e) => {
      e.preventDefault();
      document.getElementById("emojiTrigger")?.click();
    },
    { enableOnFormTags: true }
  );
  useHotkeys(
    "alt+w",
    (e) => {
      e.preventDefault();
      document.getElementById("fileTrigger")?.click();
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    "alt+l",
    (e) => {
      e.preventDefault();
      document.getElementById("locationTrigger")?.click();
    },
    { enableOnFormTags: true }
  );
  useHotkeys(
    "alt+d",
    (e) => {
      e.preventDefault();
      document.getElementById("descriptionTrigger")?.click();
    },
    { enableOnFormTags: true }
  );
  useHotkeys(
    "alt+w",
    (e) => {
      e.preventDefault();
      document.getElementById("fileTrigger")?.click();
    },
    { enableOnFormTags: true }
  );
  useHotkeys(
    "alt+s",
    (e) => {
      e.preventDefault();
      document.getElementById("dateTrigger")?.click();
    },
    { enableOnFormTags: true }
  );

  const emojiTrigger = useMemo(
    () => (
      <EmojiPicker
        setEmoji={(s) => setFormData((e) => ({ ...e, title: e.title + s }))}
        useNativeEmoji
      >
        <IconButton
          id="emojiTrigger"
          size="small"
          sx={{
            ...styles.button(false),
            ml: -0.7,
            display: { xs: "none", sm: "flex" },
          }}
        >
          <Icon>sentiment_satisfied</Icon>
        </IconButton>
      </EmojiPicker>
    ),
    [setFormData, styles]
  );
  const locationTrigger = useMemo(
    () => (
      <IconButton
        id="locationTrigger"
        size="small"
        sx={styles.button(showedFields.location)}
        onClick={() => {
          setShowedFields((s) => ({ ...s, location: !s.location }));
          if (showedFields.location) {
            setFormData((s) => ({ ...s, location: "" }));
          }
          setTimeout(() => locationRef?.current?.focus());
        }}
      >
        <Icon>location_on</Icon>
      </IconButton>
    ),
    [styles, showedFields.location]
  );
  const descriptionTrigger = useMemo(
    () => (
      <IconButton
        id="descriptionTrigger"
        size="small"
        sx={styles.button(showedFields.description)}
        onClick={() => {
          setShowedFields((s) => ({ ...s, description: !s.description }));
          if (showedFields.description) {
            setFormData((s) => ({ ...s, description: "" }));
          }
          setTimeout(() => descriptionRef?.current?.focus());
        }}
      >
        <Icon>sticky_note_2</Icon>
      </IconButton>
    ),
    [setShowedFields, styles, showedFields.description]
  );

  const fileTrigger = useMemo(
    () => (
      <FileDropInput
        onError={() => toast.error("Couldn't upload")}
        onSuccess={(res) => {
          setFormData((s) => ({
            ...s,
            image: JSON.stringify(res.data),
          }));
          setImageUploading(false);
        }}
        onUploadStart={() => setImageUploading(true)}
      >
        <IconButton
          size="small"
          sx={styles.button(formData.image)}
          id="fileTrigger"
        >
          <Icon>attach_file</Icon>
        </IconButton>
      </FileDropInput>
    ),
    [formData, setFormData, styles]
  );
  // const ref = useRef();

  return (
    <>
      {triggerBadge}
      <SwipeableDrawer
        anchor="bottom"
        onClose={() => {
          setOpen(false);
          window.location.hash = "";
        }}
        open={open}
        onClick={() => titleRef?.current?.focus()}
        PaperProps={{
          sx: {
            background: "transparent",
            borderRadius: 0,
            overflowX: "hidden",
          },
        }}
      >
        <ChipBar
          locationRef={locationRef}
          titleRef={titleRef}
          showedFields={showedFields}
          setShowedFields={setShowedFields}
          data={formData}
          boardData={boardData}
          setData={setFormData}
          chipStyles={styles.chip}
          isSubTask={isSubTask}
        />
        {boardData && !isMobile && <ColumnData boardData={boardData} />}
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
            maxRows={4}
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
                  maxRows={6}
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
            {emojiTrigger}
            {locationTrigger}
            {descriptionTrigger}
            {fileTrigger}
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <LoadingButton
                disableRipple
                variant="contained"
                loading={imageUploading}
                disabled={loading || formData.title.trim() === ""}
                onClick={handleSubmit}
                sx={{ px: 2, minWidth: "unset" }}
              >
                <Icon>arrow_upward</Icon>
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
