import {
  Box,
  CircularProgress,
  Icon,
  ListItemButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useApi } from "../../../lib/client/useApi";
import { Puller } from "../../Puller";
import { GoalCard } from "./Card";

export function CustomizeRoutine({ setData, editButtonRef, routine }) {
  const { data } = useApi("user/routines");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ListItemButton onClick={handleOpen} sx={{ gap: 2 }} ref={editButtonRef}>
        <Icon className="outlined">edit</Icon>
        Customize
      </ListItemButton>

      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        BackdropProps={{
          className: "override-bg",
          sx: {
            background: "transparent",
            backdropFilter: "blur(10px)",
          },
        }}
        PaperProps={{
          sx: {
            userSelect: "none",
            maxWidth: "600px",
            maxHeight: "90vh",
          },
        }}
      >
        <Box
          sx={{
            "& .puller": {
              background: "hsl(240, 11%, 30%)",
            },
          }}
        >
          <Puller />
        </Box>
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Routine
          </Typography>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Add goals
          </Typography>
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
