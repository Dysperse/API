import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Icon,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function GoalCard({ setData, routine, goal, goals }) {
  const included = Boolean(
    goals.find((g) => g.id === goal.id && goal.routineId === routine.id)
  );
  const addedOnAnotherRoutine =
    goal.routineId !== routine.id && goal.routineId !== null;

  const [added, setAdded] = useState(included);
  const [loading, setLoading] = useState(false);

  const session = useSession();

  const handleClick = async () => {
    setLoading(true);
    toast.success(
      !added ? "Added goal to routine!" : "Removed goal from routine!",
      toastStyles
    );

    await fetchRawApi("user/routines/assignToRoutine", {
      id: goal.id,
      routineId: !added ? routine.id : "-1",
    });

    const res = await fetchRawApi("user/routines/custom-routines/items", {
      id: routine.id,
    });
    setAdded(!added);
    setData(res[0]);
    setLoading(false);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        my: 1,
        color: `hsl(240, 11%, ${session.user.darkMode ? 90 : 10}%)`,
      }}
    >
      <CardActionArea
        sx={{
          ...(addedOnAnotherRoutine && { opacity: 0.5 }),
          display: "flex",
          alignItems: "center",
        }}
        disabled={addedOnAnotherRoutine}
        onClick={handleClick}
      >
        <CardContent>
          <Typography sx={{ fontWeight: 700 }}>{goal.name}</Typography>
          <Typography variant="body2">
            {goal.lastCompleted
              ? `Last worked on ${dayjs(goal.lastCompleted).fromNow()}`
              : "No progress (yet!)"}
          </Typography>
        </CardContent>
        {loading ? (
          <CircularProgress sx={{ ml: "auto", mr: 2 }} size={20} />
        ) : (
          <Icon className="outlined" sx={{ ml: "auto", mr: 2 }}>
            {addedOnAnotherRoutine
              ? "error"
              : added
              ? "check_circle"
              : "cancel"}
          </Icon>
        )}
      </CardActionArea>
    </Card>
  );
}
