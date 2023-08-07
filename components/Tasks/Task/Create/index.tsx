import EmojiPicker from "@/components/EmojiPicker";
import { FileDropInput } from "@/components/FileDrop";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { vibrate } from "@/lib/client/vibration";
import {
  Box,
  Button,
  Icon,
  IconButton,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
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
import ChipBar from "./ChipBar";

const MemoizedTextField = memo(TextField);

interface TaskCreationProps {
  children: JSX.Element;
  onSuccess?: () => void;
  closeOnCreate?: boolean;
}

export function CreateTask({
  children,
  onSuccess,
  closeOnCreate = false,
}: TaskCreationProps) {
  const session = useSession();
  const titleRef: any = useRef();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "grey",
    location: "",
    image: "",
    pinned: false,
    date: dayjs().startOf("day"),
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
      [name]: value.replaceAll("\n", ""),
    }));
  }, []);

  const styles = useMemo(
    () => ({
      button: (active) => ({
        background: palette[active ? 5 : 2] + "!important",
        color: palette[active ? 11 : 12] + "!important",
        borderRadius: 3,
        p: 0.5,
        mr: 0.3,
        ...(active && {
          "& *": {
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
      vibrate(50);
      fetchRawApi(session, "property/boards/column/task/create", {
        ...formData,
        ...(formData.image && { image: JSON.parse(formData.image).url }),
        pinned: formData.pinned ? "true" : "false",
        due: formData.date ? formData.date.toISOString() : "false",
        // boardId,
        // columnId: (column || { id: -1 }).id,
      });
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
    },
    [closeOnCreate, formData, session]
  );

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        onClose={() => setOpen(false)}
        open={open}
        PaperProps={{ sx: { background: "transparent", borderRadius: 0 } }}
      >
        <ChipBar
          showedFields={showedFields}
          setShowedFields={setShowedFields}
          data={formData}
          setData={setFormData}
          chipStyles={(e) => ({
            mr: 1,
            px: 1,
            background: palette[e ? 8 : 3] + "!important",
          })}
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
              sx: {
                fontSize: "20px",
                textDecoration: "underline",
              },
            }}
          />

          {showedFields.description && (
            <MemoizedTextField
              placeholder="Note"
              variant="standard"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              InputProps={{ disableUnderline: true }}
            />
          )}

          {showedFields.location && (
            <MemoizedTextField
              placeholder="Meeting URL or location"
              variant="standard"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              InputProps={{ disableUnderline: true }}
            />
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="small"
              sx={{ ...styles.button(formData.pinned), ml: -0.5 }}
              onClick={() => {
                setFormData((s) => ({ ...s, pinned: !s.pinned }));
                titleRef?.current?.focus();
              }}
            >
              <Icon className="outlined">push_pin</Icon>
            </IconButton>
            <EmojiPicker
              emoji=""
              setEmoji={(s) => {
                setFormData((e) => ({ ...e, title: e.title + s }));
              }}
              useNativeEmoji
            >
              <IconButton size="small" sx={styles.button(false)}>
                <Icon className="outlined">sentiment_satisfied</Icon>
              </IconButton>
            </EmojiPicker>
            <IconButton
              size="small"
              sx={styles.button(showedFields.location)}
              onClick={() =>
                setShowedFields((s) => ({ ...s, location: !s.location }))
              }
            >
              <Icon className="outlined">location_on</Icon>
            </IconButton>
            <IconButton
              size="small"
              sx={styles.button(showedFields.description)}
              onClick={() =>
                setShowedFields((s) => ({ ...s, description: !s.description }))
              }
            >
              <Icon className="outlined">sticky_note_2</Icon>
            </IconButton>
            <FileDropInput
              onError={() => toast.error("Couldn't upload")}
              onSuccess={(res) => {
                setFormData((s) => ({
                  ...s,
                  image: JSON.stringify(res),
                }));
              }}
              onUploadStart={() => {}}
            >
              <IconButton size="small">
                <Icon className="outlined">attach_file</Icon>
              </IconButton>
            </FileDropInput>

            <Button
              disableRipple
              variant="contained"
              disabled={formData.title.trim() === ""}
              onClick={handleSubmit}
              sx={{ ml: "auto", px: 2, minWidth: "unset" }}
            >
              <Icon>keyboard_arrow_up</Icon>
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
