import { Masonry } from "@mui/lab";
import {
  AppBar,
  Box,
  Drawer,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useSession } from "../../../../lib/client/useSession";
import { ExploreGoalCard } from "../../Routines/Create/ExploreGoalCard";
import { FeaturedRoutine } from "../../Routines/Create/FeaturedRoutine";
import { CreateGoal as CreateCustomGoal } from "./Custom";
import { categories, goals, routines } from "./goalTemplates";

export function CreateGoal({ mutationUrl }) {
  const session = useSession();

  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const randomRoutine = useMemo(
    () => routines[Math.floor(Math.random() * routines.length)],
    []
  );

  const shuffled = useMemo(() => goals.sort(() => Math.random() - 0.5), []);

  return (
    <>
      <Drawer
        ModalProps={{ keepMounted: false }}
        open={open}
        onClose={handleClose}
        anchor="bottom"
        PaperProps={{
          sx: {
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
          },
        }}
      >
        <AppBar sx={{ background: "rgba(255,255,255,.8)" }}>
          <Toolbar sx={{ gap: 2 }}>
            <IconButton onClick={handleClose}>
              <Icon>expand_more</Icon>
            </IconButton>
            <Typography sx={{ fontWeight: 700 }}>Explore</Typography>
            <CreateCustomGoal mutationUrl={mutationUrl} />
          </Toolbar>
        </AppBar>
        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          <FeaturedRoutine
            routine={randomRoutine}
            mutationUrl={mutationUrl}
            setOpen={setOpen}
          />
          <Box
            sx={{
              px: { xs: 1, sm: 2 },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: { xs: 2, sm: 4 },
                mt: { xs: 5, sm: 7 },
                fontSize: { xs: 25, sm: 30 },
              }}
            >
              Freshly picked for you
            </Typography>
            <Box sx={{ mr: -2 }}>
              <Masonry spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
                {shuffled.slice(0, 6).map((goal, index) => (
                  <ExploreGoalCard key={index} goal={goal} />
                ))}
              </Masonry>
            </Box>

            {categories.map((category) => (
              <Box
                key={category}
                sx={{
                  px: { xs: 1, sm: 2 },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ mb: 4, mt: 7, fontSize: { xs: 30, sm: 30 } }}
                >
                  {category}
                </Typography>
                <Box sx={{ mr: -2 }}>
                  <Masonry spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
                    {shuffled
                      .filter((goal) => goal.category === category)
                      .map((goal, index) => (
                        <ExploreGoalCard key={index} goal={goal} />
                      ))}
                  </Masonry>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
      <Box
        id="createGoalTrigger"
        onClick={handleOpen}
        sx={{
          flexShrink: 0,
          borderRadius: 5,
          flex: "0 0 70px",
          gap: 0.4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          userSelect: "none",
          p: 1,
          transition: "transform .2s",
          "&:hover": {
            background: `hsl(240, 11%, ${session.user.darkMode ? 10 : 95}%)`,
          },
          "&:active": {
            transition: "none",
            transform: "scale(.95)",
          },
        }}
      >
        <Box
          sx={{
            borderRadius: 9999,
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(200,200,200,.2)",
            position: "relative",
          }}
        >
          <Icon className="outlined">loupe</Icon>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              textAlign: "center",
              textOverflow: "ellipsis",
              fontSize: "13px",
              overflow: "hidden",
            }}
          >
            New goal
          </Typography>
        </Box>
      </Box>
    </>
  );
}
