import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Icon } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AvailabilityTrigger() {
  const router = useRouter();
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("availability") !== "true") setShowDot(true);
  }, [setShowDot]);

  return (
    // <Badge
    //   badgeContent={showDot ? 1 : 0}
    //   variant="dot"
    //   className="button"
    //   sx={{
    //     width: "100%",
    //     "& .MuiBadge-badge": {
    //       mt: 0.5,
    //       ml: -0.5,
    //     },
    //   }}
    // >
    <Box
      className="button"
      sx={{ width: "100%" }}
      onClick={() => {
        router.push("/availability");
        localStorage.setItem("availability", "true");
      }}
    >
      <Icon className="outlined">&#xf565;</Icon>
      Availability
    </Box>
    // </Badge>
  );
}
