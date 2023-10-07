import { Badge, Button, Icon } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function AvailabilityTrigger() {
  const router = useRouter();
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("availability") !== "true") setShowDot(true);
  }, [setShowDot]);

  return (
    <Badge
      badgeContent={showDot ? 1 : 0}
      color="info"
      variant="dot"
      sx={{
        "& .MuiBadge-badge": {
          mt: 0.5,
          ml: -0.5,
        },
      }}
    >
      <Button
        variant="contained"
        onClick={() => {
          router.push("/availability");
          localStorage.setItem("availability", "true");
        }}
      >
        <Icon className="outlined">&#xf565;</Icon>
        Availability
      </Button>
    </Badge>
  );
}
