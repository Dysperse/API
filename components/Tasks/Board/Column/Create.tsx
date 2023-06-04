import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { colors } from "@/lib/colors";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Icon,
  MenuItem,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import EmojiPicker from "../../../EmojiPicker";
import { Puller } from "../../../Puller";

export default function CreateColumn({
  hide,
  setCurrentColumn,
  id,
  mutationUrls,
  mobile = false,
}: any) {
  const storage = useAccountStorage();
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const ref: any = useRef();
  const [loading, setLoading] = useState<boolean>(false);
  const [emoji, setEmoji] = useState("1f3af");

  const handleSubmit = useCallback(() => {
    setLoading(true);
    if (ref?.current?.value.trim() === "") {
      toast.error("Enter a name for this column", {
        icon: "👀",
        ...toastStyles,
      });
      setLoading(false);
      return;
    }
    fetchRawApi("property/boards/column/create", {
      title: ref?.current?.value,
      emoji,
      id: id,
    })
      .then(async () => {
        toast.success("Created column!", toastStyles);
        setOpen(false);
        await mutate(mutationUrls.tasks);
        await mutate(mutationUrls.boardData);
        setCurrentColumn((e) => e + 1);
        setLoading(false);
        setEmoji(
          "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png"
        );
        setOpen(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error(
          "An error occurred while creating the column. Try again later.",
          toastStyles
        );
      });
  }, [emoji, id, mutationUrls, setCurrentColumn]);

  useEffect(() => {
    if (open || mobileOpen) {
      setTimeout(() => {
        const el = document.getElementById("create-column-title");
        if (el) el.focus();
      });
    }
  }, [open, mobileOpen]);

  const Children = ({ mobile = false }) => (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mx: 2,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          ...(mobile
            ? {
                mb: 2,
              }
            : {
                backgroundColor: `hsl(240,11%,${
                  session.user.darkMode ? 13 : 40
                }%)`,
                width: "400px",
                flex: "0 0 auto",
                mr: 2,
                border: `hsl(240,11%,${session.user.darkMode ? 30 : 60}%)`,
              }),
          height: "auto",
          borderRadius: 5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <EmojiPicker emoji={emoji} setEmoji={setEmoji}>
            <Button
              size="small"
              sx={{
                px: 1,
                background: `hsl(240,11%,${session.user.darkMode ? 17 : 70}%)`,
                borderRadius: 5,
              }}
            >
              <picture>
                <img
                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                  alt="emoji"
                />
              </picture>
            </Button>
          </EmojiPicker>
          <TextField
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                document.getElementById("createColumnButton")?.click();
              }
              if (e.key === "Escape") {
                setOpen(false);
                setMobileOpen(false);
              }
            }}
            id="create-column-title"
            inputRef={ref}
            variant="standard"
            placeholder="Column name"
            InputProps={{
              disableUnderline: true,
              sx: {
                background: `hsl(240,11%,${session.user.darkMode ? 20 : 95}%)`,
                fontWeight: "600",
                fontSize: 20,
                px: 2,
                py: 1,
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 1,
            gap: 2,
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => {
              setMobileOpen(false);
              setOpen(false);
            }}
            fullWidth
            variant="outlined"
          >
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            id="createColumnButton"
            variant="contained"
            fullWidth
            sx={{
              background: `${
                colors[session?.themeColor || "grey"][900]
              }!important`,
              color: "white",
              border: "1px solid transparent !important",
            }}
            onClick={handleSubmit}
          >
            Create
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        sx={{
          zIndex: 9999999999,
        }}
      >
        <Puller />
        <Children mobile />
      </SwipeableDrawer>
      <MenuItem
        disabled={hide || storage?.isReached === true}
        onClick={() => setMobileOpen(true)}
        id="newColumn"
      >
        <Icon className="outlined">post_add</Icon> New column
      </MenuItem>
    </>
  );
}
