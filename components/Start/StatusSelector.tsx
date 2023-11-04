import { Puller } from "@/components/Puller";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Icon,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Toolbar,
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
      ? data.status.emoji || null
      : null
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
    await fetchRawApi(session, "user/status", {
      method: "POST",
      params: {
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
      },
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
        placement="right"
        title={
          !isMobile && (status ? capitalizeFirstLetter(status) : "Set status")
        }
      >
        <IconButton
          sx={{
            ...(isMobile && {
              borderRadius: 9,
              fontSize: "15px",
              gap: 2,
            }),
            width: 36,
            height: 36,
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

  const disabled =
    !status || !time || isNotificationDataLoading || isStatusLoading;

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
            height: "100dvh",
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Puller showOnDesktop />
          <AppBar>
            <Toolbar>
              <IconButton onClick={() => setOpen(false)}>
                <Icon>close</Icon>
              </IconButton>
              <Typography sx={{ ...typographyStyles, my: 0, mx: "auto" }}>
                Set status
              </Typography>
              <IconButton
                onClick={handleSubmit}
                disabled={disabled}
                sx={{
                  ...(!disabled && {
                    background: palette[9],
                    color: palette[1],
                  }),
                }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Icon
                    sx={{
                      fontVariationSettings:
                        '"FILL" 0, "wght" 500, "GRAD" 0, "opsz" 40!important',
                    }}
                  >
                    check
                  </Icon>
                )}
              </IconButton>
            </Toolbar>
          </AppBar>

          <Typography variant="body2" sx={typographyStyles}>
            My availability...
          </Typography>
          <Box sx={{ display: "flex", overflowX: "scroll", gap: 2, px: 2 }}>
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
            Clear after...
          </Typography>
          <Box sx={{ display: "flex", overflowX: "scroll", gap: 2, px: 2 }}>
            <FormControl fullWidth>
              <Select
                value={time}
                onChange={(e: any) => {
                  setTime(parseInt(e.target.value));
                }}
              >
                {[60, 120, 240, 360, 600, 1440].map((_time) => (
                  <MenuItem key={_time} value={_time} selected={_time === time}>
                    {_time / 60} hour{_time / 60 !== 1 && "s"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ px: 2, mt: 4 }}>
            <Divider />
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
                        {emoji ? (
                          <img
                            src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                            alt="Crying emoji"
                            width={25}
                          />
                        ) : (
                          <Icon className="outlined">add_reaction</Icon>
                        )}
                      </IconButton>
                    </EmojiPicker>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
