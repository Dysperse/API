import { Puller } from "@/components/Puller";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Divider,
  Icon,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";

export function ExploreGoalCard({ goal }) {
  const router = useRouter();
  const session = useSession();

  const [routine, setRoutine] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { data, error } = useApi("user/coach/routines");
  const routines = data || [];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetchRawApi("user/coach/goals/create", {
        name: goal.name,
        stepName: goal.stepName,
        category: goal.category,
        durationDays: goal.durationDays,
        time: goal.time,
      });
      setLoading(false);
      router.push("/coach");
    } catch (e) {
      setLoading(false);
      toast.error(
        "An error occurred while trying to set your goal. Please try again.",
        toastStyles
      );
    }
  };

  return (
    <>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        onOpen={() => {}}
        PaperProps={{
          sx: {
            display: "flex",
            px: 2,
            pb: 2,
            flexDirection: "column",
            height: "calc(100vh - 100px)",
          },
        }}
      >
        <Puller showOnDesktop />
        <Box>
          <Typography variant="h6">{goal.name}</Typography>
          <Typography>{goal.description}</Typography>
          <Divider sx={{ my: 3 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, opacity: 0.9, mb: 2, textAlign: "center" }}
          >
            SELECT A ROUTINE
          </Typography>
        </Box>
        <Virtuoso
          style={{
            borderRadius: 5,
            flexGrow: 1,
            height: "100%",
            marginBottom: "10px",
          }}
          totalCount={routines.length == 0 ? 1 : routines.length}
          itemContent={(index) => {
            const thisRoutine = routines[index];
            return routines.length == 0 ? (
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
                  gap: 1,
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
                <Typography sx={{ fontWeight: 700 }}>
                  You haven&apos;t created any routines yet
                </Typography>
              </Box>
            ) : (
              <Card
                variant="outlined"
                sx={{
                  my: 1,
                  color: `hsl(240, 11%, ${session.user.darkMode ? 90 : 10}%)`,
                  transition: "none",
                  borderRadius: 3,
                  ...(routine === thisRoutine.id && {
                    borderColor: `hsl(240, 11%, ${
                      session.user.darkMode ? 90 : 10
                    }%)`,
                    boxShadow: `0 0 0 1px inset hsl(240, 11%, ${
                      session.user.darkMode ? 90 : 10
                    }%)`,
                  }),
                }}
              >
                <CardActionArea
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    gap: 2,
                  }}
                  onClick={() => setRoutine(thisRoutine.id)}
                >
                  <picture>
                    <img
                      src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${thisRoutine.emoji}.png`}
                      alt="Crying emoji"
                      width={40}
                      height={40}
                    />
                  </picture>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {thisRoutine.name}
                  </Typography>
                  <Icon className="outlined" sx={{ ml: "auto", mr: 2 }}>
                    {routine === thisRoutine.id && "check_circle"}
                  </Icon>
                </CardActionArea>
              </Card>
            );
          }}
        />
        <Button
          sx={{ mt: "auto" }}
          disabled={routine == null}
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
          background: session.user.darkMode
            ? "hsl(240,11%,20%)"
            : "rgba(200,200,200,.3)",
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
