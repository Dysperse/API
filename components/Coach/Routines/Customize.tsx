import {
  Box,
  Button,
  CircularProgress,
  Icon,
  InputAdornment,
  ListItemButton,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { useDeferredValue, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { useApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { Puller } from "../../Puller";
import { GoalCard } from "./Card";

export function CustomizeRoutine({ handleParentClose, setData, routine }) {
  const { data } = useApi("user/routines");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const goals = data
    ? data.filter(
        (goal) => !goal.completed && goal.progress < goal.durationDays
      )
    : [];

  const session = useSession();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const deferredQuery = useDeferredValue(query);

  const filteredGoals = goals.filter((goal) =>
    goal.name.toLowerCase().includes(deferredQuery)
  );

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
        <Box sx={{ px: 2 }}>
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
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
            placeholder="Search for a goal..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>search</Icon>
                </InputAdornment>
              ),
            }}
          />
          {data ? (
            <Virtuoso
              style={{
                height: "100vh",
                maxHeight: "calc(100vh - 200px)",
              }}
              totalCount={filteredGoals.length == 0 ? 1 : filteredGoals.length}
              itemContent={(index) =>
                filteredGoals.length == 0 ? (
                  <Box
                    sx={{
                      mb: 2,
                      p: 3,
                      height: "100%",
                      background: `hsl(240,11%,${
                        session.user.darkMode ? 10 : 95
                      }%)`,
                      borderRadius: 3,
                      width: "100%",
                      fontSize: "14px",
                      fontWeight: 700,
                      display: "flex",
                      my: "10px",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <picture>
                      <img
                        src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62d.png"
                        alt="Crying emoji"
                      />
                    </picture>
                    <Typography sx={{ mt: 1, fontWeight: 700 }}>
                      {query == ""
                        ? "You haven't set any goals (yet!)"
                        : "No results found"}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        document.getElementById("createGoalTrigger")?.click();
                        handleClose();
                        handleParentClose();
                      }}
                    >
                      Create a goal
                    </Button>
                  </Box>
                ) : (
                  <GoalCard
                    setData={setData}
                    goal={filteredGoals[index]}
                    key={filteredGoals[index].id}
                    goals={data}
                    routine={routine}
                  />
                )
              }
            />
          ) : (
            <CircularProgress />
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}
