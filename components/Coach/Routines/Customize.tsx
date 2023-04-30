import {
  Box,
  CircularProgress,
  Icon,
  ListItemButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { useApi } from "../../../lib/client/useApi";
import { Puller } from "../../Puller";
import { GoalCard } from "./Card";

export function CustomizeRoutine({ setData, routine }) {
  const { data } = useApi("user/routines");
  const [open, setOpen] = useState(false);
  const goals = data
    ? data.filter(
        (goal) => !goal.completed && goal.progress < goal.durationDays
      )
    : [];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ListItemButton onClick={handleOpen} sx={{ gap: 2 }}>
        <Icon className="outlined">edit</Icon>
        Customize
      </ListItemButton>

      <SwipeableDrawer
        open={open}
        anchor="bottom"
        ModalProps={{ keepMounted: false }}
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
        sx={{
          zIndex: "9999999!important",
        }}
      >
        <Puller />
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}
          >
            <picture>
              <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${routine.emoji}.png`}
                alt="emoji"
                width={35}
                height={35}
              />
            </picture>
            {routine.name}
          </Typography>
          {data ? (
            <Virtuoso
              style={{ height: "400px", maxHeight: "calc(100vh - 200px)" }}
              totalCount={goals.length}
              itemContent={(index) => (
                <GoalCard
                  setData={setData}
                  goal={goals[index]}
                  key={goals[index].id}
                  goals={data}
                  routine={routine}
                />
              )}
            />
          ) : (
            <CircularProgress />
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}
