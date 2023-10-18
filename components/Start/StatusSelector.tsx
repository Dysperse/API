import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import {
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import EmojiPicker from "../EmojiPicker";

export function StatusSelector({
  children,
  profile,
  mutate,
}: {
  children?: JSX.Element;
  profile: any;
  mutate: any;
}) {
  const { session } = useSession();
  const now = useMemo(() => dayjs(), []);

  const {
    data,
    mutate: mutateStatus,
    isLoading: isStatusLoading,
  } = useSWR(["user/status"]);

  const { data: notificationData, isLoading: isNotificationDataLoading } =
    useSWR(["user/settings/notifications"]);

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [emoji, setEmoji] = useState(
    data?.status && data?.until && dayjs(data?.until).isAfter(now)
      ? data.status.emoji || "1f4ad"
      : "1f4ad"
  );

  const [status, setStatus] = useState(
    data?.status && data?.until && dayjs(data?.until).isAfter(now)
      ? data?.status
      : ""
  );

  const textRef: any = useRef();
  const [time, setTime] = useState(60);
  const [loading, setLoading] = useState(false);

  const handleStatusSelect = useCallback(
    (status: string) => () => setStatus(status),
    []
  );
  const handleTimeSelect = useCallback(
    (time: number) => () => setTime(time),
    []
  );

  useEffect(() => {
    if (
      textRef?.current &&
      data?.until &&
      dayjs(data?.until).isAfter(now) &&
      data?.status?.text
    ) {
      textRef.current.value = data.status.text;
    }
  }, [data, now]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    await fetchRawApi(session, "user/status/set", {
      status,
      start: new Date().toISOString(),
      until: time,
      timeZone: session.user.timeZone,
      profile: JSON.stringify(profile),
      email: session.user.email,
      emoji,
      text: textRef?.current?.value,
      notifyFriendsForStatusUpdates:
        notificationData.notifyFriendsForStatusUpdates ? "true" : "false",
    });
    setOpen(false);
    toast.success(
      "Status set until " + dayjs().add(time, "minute").format("h:mm A")
    );
    mutateStatus();
    mutate();
    setLoading(false);
  }, [
    session,
    status,
    time,
    mutate,
    profile,
    setLoading,
    mutateStatus,
    emoji,
    notificationData,
  ]);

  const resetStatus = useCallback(
    () =>
      setStatus(
        data?.status && data?.until && dayjs(data?.until).isAfter(now)
          ? data?.status
          : ""
      ),
    [data, now]
  );

  useEffect(() => {
    if (data) {
      resetStatus();
    }
  }, [data, resetStatus]);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));

  const chipPalette =
    status === "available"
      ? greenPalette
      : status === "busy"
      ? redPalette
      : status === "away"
      ? orangePalette
      : grayPalette;

  const trigger = cloneElement(
    children || (
      <Tooltip
        title={
          !isMobile && (status ? capitalizeFirstLetter(status) : "Set status")
        }
      >
        <IconButton
          sx={{
            ...(isMobile && {
              px: 2,
              borderRadius: 9,
              fontSize: "15px",
              gap: 2,
              ml: "auto",
              mr: 1,
            }),
            "&, &:hover": {
              background: `linear-gradient(${chipPalette[6]}, ${chipPalette[3]}) !important`,
              color: `${chipPalette[12]} !important`,
              "&:active": {
                background: `linear-gradient(-90deg, ${chipPalette[6]}, ${chipPalette[3]}) !important`,
              },
            },
          }}
        >
          <Icon className="outlined">
            {status === "available" ? (
              "check_circle"
            ) : status === "busy" ? (
              "remove_circle"
            ) : status === "away" ? (
              "dark_mode"
            ) : (
              <>&#xe1af;</>
            )}
          </Icon>
          {isMobile && (status ? capitalizeFirstLetter(status) : "")}
        </IconButton>
      </Tooltip>
    ),
    {
      onClick: () => setOpen(true),
    }
  );

  const typographyStyles = {
    mb: 1,
    mt: 4,
    px: 2,
    textTransform: "uppercase",
    opacity: 0.6,
    fontWeight: 900,
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => {
          setOpen(false);
          resetStatus();
        }}
        PaperProps={{
          sx: {
            border: `2px solid ${addHslAlpha(palette[3], 0.7)}`,
            borderRadius: 5,
            m: 2,
            mx: { xs: 2, sm: "auto" },
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Puller showOnDesktop />
          {/* {notificationData.notifyFriendsForStatusUpdates ? 1 : 0} */}
          <Typography variant="body2" sx={typographyStyles}>
            My availability...
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, px: 2 }}>
            {["available", "busy", "away", "offline"].map((_status) => (
              <Button
                key={_status}
                onClick={handleStatusSelect(_status)}
                sx={{ px: 2, flexShrink: 0 }}
                variant={_status === status ? "contained" : "outlined"}
                size="large"
              >
                {_status === status && <Icon>check</Icon>}
                {capitalizeFirstLetter(_status)}
              </Button>
            ))}
          </Box>

          <Typography variant="body2" sx={typographyStyles}>
            What&apos;s up?
          </Typography>
          <Box sx={{ px: 2, mb: 2 }}>
            <TextField
              placeholder="What's on your mind?"
              autoComplete="off"
              inputRef={textRef}
              onKeyDown={(e) => {
                if (e.code === "Enter") handleSubmit();
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmojiPicker
                      setEmoji={(s) => {
                        setTimeout(() => {
                          setEmoji(s);
                          textRef?.current?.focus();
                        });
                      }}
                    >
                      <IconButton size="small">
                        <img
                          src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                          alt="Crying emoji"
                          width={25}
                        />
                      </IconButton>
                    </EmojiPicker>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Typography variant="body2" sx={typographyStyles}>
            Clear after...
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, px: 2 }}>
            {[60, 120, 240, 600, 1440].map((_time) => (
              <Button
                key={_time}
                onClick={handleTimeSelect(_time)}
                sx={{ px: 2, flexShrink: 0 }}
                variant={_time === time ? "contained" : "outlined"}
                size="large"
              >
                {_time === time && <Icon>check</Icon>}
                {_time / 60} hour{_time / 60 !== 1 && "s"}
              </Button>
            ))}
          </Box>
          <Box sx={{ px: 2 }}>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit}
              sx={{ px: 2, mb: 2, mx: "auto", mt: 2 }}
              variant="contained"
              fullWidth
              size="large"
              disabled={
                !status || !time || isNotificationDataLoading || isStatusLoading
              }
            >
              Done
            </LoadingButton>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
