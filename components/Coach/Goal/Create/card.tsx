import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { Box, Button, Icon, SwipeableDrawer, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function ExploreGoalCard({ goal }) {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { data, error } = useApi("user/coach/routines");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetchRawApi(session, "user/coach/goals/create", {
        name: goal.name,
        stepName: goal.stepName,
        category: goal.category,
        durationDays: goal.durationDays,
      });
      setLoading(false);
      router.push("/coach");
    } catch (e) {
      setLoading(false);
      toast.error(
        "An error occurred while trying to set your goal. Please try again.",
        toastStyles,
      );
    }
  };

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
