import { ShareGoal } from "@/components/Coach/Goal/ShareGoal";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";

function GoalTask({ goal, setSlide, mutationUrl }) {
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);

  const handleNext = () => {
    setSlide((s) => s + 1);
    fetchRawApi("user/coach/goals/markAsDone", {
      date: dayjs().format("YYYY-MM-DD"),
      progress:
        goal.progress && parseInt(goal.progress)
          ? goal.progress + 1 > goal.durationDays
            ? goal.durationDays
            : goal.progress + 1
          : 1,
      id: goal.id,
    })
      .then(() => mutate(mutationUrl))
      .catch(() =>
        toast.error(
          "Yikes! Something went wrong while trying to mark your routine as done",
          toastStyles
        )
      );
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          px: 3,
          background: palette[2],
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ mt: "auto" }}>
          <Chip label={`${goal.timeOfDay}:00`} sx={{ mb: 2 }} />
          <Typography
            variant="h1"
            sx={{ lineHeight: "85px" }}
            className="font-heading"
          >
            {goal.stepName}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            {~~((goal.progress / goal.durationDays) * 100)}% complete
          </Typography>
        </Box>
        <Button
          sx={{ mt: "auto", mb: 2, background: palette[3] }}
          variant="contained"
          onClick={handleNext}
        >
          I completed this task!
        </Button>
      </Box>
      <Box sx={{ mt: "auto", width: "100%", p: 1, display: "flex" }}>
        <Button sx={{ color: "#fff" }} size="small">
          <Icon>local_fire_department</Icon>
          Activity
        </Button>
        <ShareGoal goal={goal}>
          <IconButton sx={{ ml: "auto" }}>
            <Icon>ios_share</Icon>
          </IconButton>
        </ShareGoal>
      </Box>
    </Box>
  );
}

export default function Routine() {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);

  const { data, url, error } = useApi("user/coach");

  const [slide, setSlide] = useState(-1);

  useEffect(() => {
    if (data && data[0]) setSlide(0);
  }, [data]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: palette[1],
        zIndex: 999,
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          top: 0,
          gap: 0.5,
          p: 1,
          width: "100%",
        }}
      >
        {[...new Array(data?.length || 0)].map((_, index) => (
          <Box
            key={index}
            sx={{
              height: "2px",
              width: "100%",
              background: palette[slide === index ? 10 : index < slide ? 9 : 4],
            }}
          />
        ))}
      </Box>
      <IconButton
        onClick={() => router.push("/coach")}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          m: 2,
          mt: 3,
          zIndex: 9999,
        }}
      >
        <Icon>west</Icon>
      </IconButton>
      {slide === -1 && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {data &&
        data
          .sort((a, b) => a.timeOfDay.value - b.timeOfDay.value)
          .map(
            (goal, index) =>
              slide === index && (
                <GoalTask
                  mutationUrl={url}
                  setSlide={setSlide}
                  goal={goal}
                  key={goal.id}
                />
              )
          )}
    </Box>
  );
}
