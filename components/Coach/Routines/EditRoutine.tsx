import {
  Box,
  CircularProgress,
  Icon,
  ListItemButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { Puller } from "../../Puller";
import { GoalCard } from "./GoalCard";

export function EditRoutine({ setData, editButtonRef, routine }) {
  const { data, error } = useApi("user/routines");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ListItemButton onClick={handleOpen} sx={{ gap: 2 }} ref={editButtonRef}>
        <Icon className="outlined">edit</Icon>
        Edit routine
      </ListItemButton>

      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            userSelect: "none",
            maxWidth: "600px",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography variant="h6">Add goals</Typography>
          {data ? (
            data
              .filter(
                (goal) => !goal.completed && goal.progress < goal.durationDays
              )
              .map((goal) => (
                <GoalCard
                  setData={setData}
                  goal={goal}
                  key={goal.id}
                  goals={data}
                  routine={routine}
                />
              ))
          ) : (
            <CircularProgress />
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}
