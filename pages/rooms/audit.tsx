import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import useWindowDimensions from "@/lib/client/useWindowDimensions";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { cloneElement, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import Webcam from "react-webcam";
import useSWR from "swr";

export function RoomPicker({ room, setRoom, children }) {
  const [open, setOpen] = useState(false);
  const { data, error } = useSWR(["property/inventory/rooms"]);

  const { session } = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const trigger = cloneElement(children, { onClick: () => setOpen(true) });

  useEffect(() => {
    if (!room && !open) {
      setOpen(true);
    }
  }, [room, open]);

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            background: addHslAlpha(palette[3], 0.8),
            m: 3,
            mx: { xs: 3, sm: "auto" },
            borderRadius: 5,
          },
        }}
      >
        <Typography variant="h3" className="font-heading" sx={{ p: 3, pb: 1 }}>
          Select a room
        </Typography>
        {data ? (
          data.map((_room) => (
            <ListItemButton
              key={_room.id}
              selected={room?.id === _room?.id}
              onClick={() => {
                setRoom(_room);
                setOpen(false);
              }}
            >
              <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${_room.emoji}.png`}
                alt="Emoji"
                width={30}
                height={30}
              />
              <ListItemText primary={_room.name} />
            </ListItemButton>
          ))
        ) : (
          <CircularProgress />
        )}
      </SwipeableDrawer>
    </>
  );
}

export default function Page() {
  const webcamRef: any = useRef(null);
  const { session } = useSession();
  const router = useRouter();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  useStatusBar("#000");

  const { width, height } = useWindowDimensions();
  const [taken, setTaken] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [room, setRoom] = useState<any>(null);

  const titleRef: any = useRef<HTMLInputElement>();

  const [frontCamera, setFrontCamera] = useState(true);

  useHotkeys("esc", () => {
    setTaken(false);
  });

  const handleCapture = async () => {
    titleRef.current.value = "";
    setTaken(true);
    setLoading(true);
    const imageUrl = await webcamRef.current.getScreenshot();
    const res = await fetch(`/api/property/inventory/items/scan`, {
      method: "POST",
      body: JSON.stringify({
        imageUrl,
      }),
    }).then((res) => res.json());
    if (res?.error?.includes("loading")) {
      toast.error(
        "We're loading our model for you. Please wait about " +
          res.estimated_time +
          " seconds and try again."
      );
      setLoading(false);
      setTaken(false);
      return;
    }

    if (!res[0]) {
      toast.error("We couldn't find any objects in the photo you took");
      setLoading(false);
      setTaken(false);
      return;
    }

    const conventions = {
      ashbin: "trash can",
      "cellular telephone": "Cell phone",
    };

    // if res[0].label.includes(any object key in conventions), replace it with the value
    // else, use res[0].label
    titleRef.current.value = capitalizeFirstLetter(res?.[0]?.label);

    for (const key in conventions) {
      if (res[0].label.toLowerCase().includes(key.toLowerCase())) {
        titleRef.current.value = capitalizeFirstLetter(conventions[key]);
      }
    }

    const res2 = res
      .map((r) => r.label?.split(",")[0])
      .flat()
      .filter((e) => e);

    setLoading(false);
    setResults(res2);
  };

  const handleSubmit = async () => {
    try {
      fetchRawApi(session, "property/inventory/items/create", {
        name: titleRef.current.value,
        room: room.id,
      });
    } catch (e: any) {
      toast.error(e.message);
    }
    setSubmitted(true);
    setTimeout(() => {
      setTaken(false);
    }, 500);
    setTimeout(() => {
      setSubmitted(false);
    }, 1000);
  };

  const [introOpen, setIntroOpen] = useState(true);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100dvw",
        height: "100dvh",
      }}
    >
      <Dialog
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        PaperProps={{
          sx: {
            width: "320px",
            maxWidth: "calc(100vw - 40px)",
          },
        }}
      >
        <Image
          src="/audit-preview.png"
          width={320}
          height={320}
          style={{ width: "100%" }}
          alt="preview"
        />
        <Typography variant="h3" className="font-heading" sx={{ p: 3, pb: 0 }}>
          For best results...
        </Typography>
        {[
          "Make sure your item is well-lit and has a clear background",
          "Only take a picture of one item at a time",
          "Take a picture of the item from a recognizable view",
        ].map((text, i) => (
          <Typography
            variant="body2"
            sx={{ p: 3, py: 1, display: "flex", gap: 2 }}
            key={i}
          >
            <Avatar
              sx={{
                fontSize: "15px",
                width: "25px",
                height: 25,
                mt: 0.5,
                background: palette[3],
                color: palette[11],
              }}
            >
              {i + 1}
            </Avatar>
            <span>{text}</span>
          </Typography>
        ))}
        <Box sx={{ p: 3, pt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setIntroOpen(false)}
          >
            Got it!
            <Icon>arrow_forward</Icon>
          </Button>
        </Box>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          height: "100dvh",
          width: "100dvw",
          overflow: "hidden",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            "& video": {
              width: "100dvw",
              height: "100%",
              objectFit: "cover",
              transition: "blur .2s ease, transform 0s",
              ...(taken && {
                transition: "all .2s ease",
                filter: "blur(30px)",
                transform: "scale(1.1)",
              }),
            },
          }}
        >
          <Webcam
            audio={false}
            height={height}
            width={width}
            ref={webcamRef}
            screenshotFormat="image/png"
            screenshotQuality={0.5}
            videoConstraints={{
              facingMode: frontCamera ? "user" : { exact: "environment" },
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            height: "100dvh",
            zIndex: 999,
            width: "100%",
            left: 0,
            bottom: 0,
            opacity: taken ? 1 : 0,
            pointerEvents: taken ? "all" : "none",
            transition: "all .3s ease",
            p: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: addHslAlpha(palette[2], 0.3),
            ...(submitted && {
              borderRadius: 5,
              animation: "submit .5s forwards",
            }),
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={() => setTaken(false)}
              sx={{
                background: addHslAlpha(palette[9], 0.1) + "!important",
                color: palette[11] + "!important",
              }}
            >
              <Icon>close</Icon>
            </IconButton>
            <Box sx={{ position: "relative", width: "100%" }}>
              <TextField
                inputRef={titleRef}
                inputProps={{
                  autoComplete: "off",
                }}
                disabled={loading}
                placeholder={loading ? "" : "Item name"}
              />
              {loading && (
                <Skeleton
                  sx={{
                    position: "absolute",
                    top: 3,
                    left: 15,
                    transition: "all .2s ease",
                  }}
                  height={50}
                  width={130}
                  animation="wave"
                />
              )}
            </Box>
            <IconButton
              onClick={handleSubmit}
              sx={{
                background: addHslAlpha(palette[9], 0.9) + "!important",
                color: palette[1] + "!important",
              }}
              disabled={loading}
            >
              <Icon>{loading ? <CircularProgress /> : "north"}</Icon>
            </IconButton>
          </Box>
          <Box
            sx={{
              overflowX: "scroll",
              display: "flex",
              maxWidth: "100vw",
              px: 5,
              gap: 2,
              mt: 2,
              height: "50px",
            }}
          >
            {results &&
              results.map((result) => (
                <Chip
                  sx={{
                    background: addHslAlpha(palette[5], 0.4) + "!important",
                  }}
                  label={capitalizeFirstLetter(result?.trim())}
                  key={result}
                  onClick={() =>
                    (titleRef.current.value = capitalizeFirstLetter(
                      result?.trim()
                    ))
                  }
                />
              ))}
          </Box>
          <TextField
            label="Quantity"
            size="small"
            placeholder="Add quantity"
            defaultValue={1}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Note"
            size="small"
            placeholder="Add note"
            sx={{ mt: 2 }}
            minRows={3}
            multiline
          />
          <TextField
            label="Tags"
            size="small"
            placeholder="Add tags..."
            sx={{ mt: 2 }}
          />
        </Box>
      </Box>
      {!taken && (
        <AppBar
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            background: "linear-gradient(rgba(0,0,0,0.7), transparent)",
            border: 0,
            backdropFilter: "none",
          }}
        >
          <Toolbar>
            <IconButton onClick={() => router.push("/rooms")}>
              <Icon>arrow_back_ios_new</Icon>
            </IconButton>
            <RoomPicker room={room} setRoom={setRoom}>
              <Button
                sx={{
                  mx: "auto",
                  color: "inherit",
                  gap: 0,
                  background: "transparent!important",
                  transition: "transform .1s!important",
                  "&:active": { transform: "scale(.9)" },
                }}
              >
                {room?.name || "Select a room"}
                <Icon>expand_more</Icon>
              </Button>
            </RoomPicker>
            <IconButton onClick={() => setFrontCamera((c) => !c)}>
              <Icon {...(!frontCamera && { className: "outlined" })}>
                flip_camera_ios
              </Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      <Box
        sx={{
          opacity: taken ? 0 : 1,
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          border: "5px solid #fff",
          transition: "all .2s ease",
          width: 70,
          zIndex: 999,
          height: 70,
          borderRadius: "100%",
          "&:active": {
            transform: "translateX(-50%) scale(0.9)",
          },
          ...(taken && {
            pointerEvents: "none",
          }),
        }}
        onClick={handleCapture}
      />
    </Box>
  );
}
