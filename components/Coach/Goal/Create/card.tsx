import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  Icon,
  IconButton,
  MenuItem,
  Select,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function ExploreGoalCard({ goal }) {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [time, setTime] = useState<number>(12);
  const [daysOfWeek, setDaysOfWeek] = useState(
    "[true,true,true,true,true,true,true]"
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetchRawApi(session, "user/coach/goals/create", {
        name: goal.name,
        stepName: goal.stepName,
        category: goal.category,
        durationDays: goal.durationDays,
        timeOfDay: time,
        daysOfWeek,
      });
      setLoading(false);
      setOpen(false);
      setTimeout(() => {
        router.push("/coach");
      }, 1000);
    } catch (e) {
      setLoading(false);
      toast.error(
        "An error occurred while trying to set your goal. Please try again.",
        toastStyles
      );
    }
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{
          sx: {
            px: 2,
            pb: 2,
          },
        }}
      >
        <Puller showOnDesktop />
        <Box>
          <Typography variant="h6">{goal.name}</Typography>
          <Typography>{goal.description}</Typography>
        </Box>
        <Box sx={{ display: "flex", my: 2, gap: 1, alignItems: "center" }}>
          {JSON.parse(daysOfWeek).map((day, index) => (
            <IconButton
              key={index.toString()}
              sx={{
                width: 45,
                color: palette[12] + "!important",
                height: 45,
                ...(JSON.parse(daysOfWeek)[index] && {
                  background: palette[3] + "!important",
                  color: palette[11] + "!important",
                }),
              }}
              onClick={() => {
                let temp = JSON.parse(daysOfWeek);
                temp[index] = !JSON.parse(daysOfWeek)[index];
                setDaysOfWeek(JSON.stringify(temp));
              }}
            >
              {days[index][0].toUpperCase()}
            </IconButton>
          ))}
        </Box>
        <Select
          size="small"
          value={time}
          fullWidth
          MenuProps={{
            sx: {
              mt: 2,
              zIndex: 999999999999,
            },
          }}
          onChange={(e) => setTime(parseInt(e.target.value as string))}
        >
          {[...Array(24).keys()].map((hour) => (
            <MenuItem key={hour} value={hour}>
              {(hour % 12 || 12) + (hour >= 12 ? " PM" : " AM")}
            </MenuItem>
          ))}
        </Select>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={handleSubmit}
          size="large"
        >
          Set
        </Button>
      </SwipeableDrawer>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          ...(loading && {
            pointerEvents: "none",
            opacity: 0.5,
          }),
          background: palette[3],
          borderRadius: 5,
          p: 2,
          cursor: "pointer",
          transition: "all .1s ease-in-out",
          "&:active": {
            transition: "none",
            transform: "scale(.98)",
          },
          userSelect: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "600" }}>{goal.name}</Typography>
          <Typography variant="body2">{goal.description}</Typography>
        </Box>
        <Icon
          sx={{
            ml: "auto",
          }}
        >
          east
        </Icon>
      </Box>
    </>
  );
}
