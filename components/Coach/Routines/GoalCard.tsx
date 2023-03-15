import {
  Card,
  CardActionArea,
  CardContent,
  Icon,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { fetchApiWithoutHook } from "../../../hooks/useApi";
import { toastStyles } from "../../../lib/useCustomTheme";

export function GoalCard({ setData, routine, goal, goals }) {
  const disabled = goal.routineId;
  const included = Boolean(goals.find((g) => g.id == goal.id));
  const [added, setAdded] = useState(included);

  const handleClick = async () => {
    setAdded(!added);
    toast.error("Added goal to routine!", toastStyles);
    await fetchApiWithoutHook("user/routines/assignToRoutine", {
      id: goal.id,
      routineId: added ? routine.id : "-1",
    });

    const res = await fetchApiWithoutHook(
      "user/routines/custom-routines/items",
      {
        id: routine.id,
      }
    );
    setData(res[0]);
  };

  return (
    <Card variant="outlined" sx={{ my: 1 }} onClick={handleClick}>
      <CardActionArea
        sx={{
          ...(disabled && { opacity: 0.5 }),
          display: "flex",
          alignItems: "center",
        }}
        disabled={disabled}
      >
        <CardContent>
          <Typography sx={{ fontWeight: 700 }}>{goal.name}</Typography>
          <Typography variant="body2">
            Last worked on {dayjs(goal.lastCompleted).fromNow()}
          </Typography>
        </CardContent>
        <Icon
          className="outlined"
          sx={{ ml: "auto", mr: 2, opacity: included ? 1 : 0 }}
        >
          {disabled ? "cancel" : "check_circle"}
        </Icon>
      </CardActionArea>
    </Card>
  );
}
