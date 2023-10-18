import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Button } from "@mui/material";
import React from "react";

export const AvailabilityButton = React.memo(function AvailabilityButton({
  showEarlyHours,
  hour,
  col,
  handleSelect,
  disabled,
  shouldHide,
}: any) {
  const { session } = useSession();
  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );
  const greenPalette = useColor(
    "green",
    useDarkMode(session?.darkMode || "system")
  );
  return (
    <Button
      disabled={disabled}
      size="small"
      onClick={() => handleSelect(hour, col.date)}
      sx={{
        ...(shouldHide && {
          display: "none!important",
        }),
        // If the user has marked their availability for this time slot, make it green
        "&:hover": {
          background: { sm: palette[4] + "!important" },
        },
        ...(col.availability && {
          background: greenPalette[6] + "!important",
          "&:hover": {
            background: { sm: greenPalette[7] + "!important" },
          },
          color: greenPalette[12] + "!important",
        }),
        height: "35px",
        borderRadius: 0,
        flexShrink: 0,
        ...(hour === 12 && {
          borderBottom: `2px solid ${palette[5]}`,
          ...(col.availability && {
            borderBottom: `2px solid ${greenPalette[5]}`,
          }),
        }),
        ...(hour < 8 && !showEarlyHours && { display: "none" }),
      }}
    >
      <span>
        {col.date.format("h")}
        <span style={{ opacity: 0.7 }}>{col.date.format("A")}</span>
      </span>
    </Button>
  );
});
