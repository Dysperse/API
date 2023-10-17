import { Icon, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export function EarlyHoursToggle({ showEarlyHours, setShowEarlyHours }) {
  const isMobile = useMediaQuery(`(max-width: 600px)`);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowTooltip(false);
    }, 1000);
  }, []);

  return (
    <Tooltip
      open={showTooltip}
      title={showEarlyHours ? "Hide early hours" : "Show early hours"}
      placement="right"
    >
      <IconButton
        onClick={() => setShowEarlyHours((e) => !e)}
        {...(isMobile
          ? {
              onTouchStart: () => setShowTooltip(true),
              onTouchEnd: () => setShowTooltip(false),
            }
          : {
              onMouseEnter: () => setShowTooltip(true),
              onMouseLeave: () => setShowTooltip(false),
            })}
      >
        <Icon sx={{ fontSize: "30px!important" }} className="outlined">
          {!showEarlyHours ? "wb_twilight" : "expand_less"}
        </Icon>
      </IconButton>
    </Tooltip>
  );
}
