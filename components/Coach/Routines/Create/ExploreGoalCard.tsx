import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { Box, Icon, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function ExploreGoalCard({ goal }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  return (
    <Box
      onClick={async () => {
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
      }}
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
  );
}
