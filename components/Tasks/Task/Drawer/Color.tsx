import { useSession } from "@/lib/client/session";
import { useDarkMode } from "@/lib/client/useColor";
import { colors } from "@/lib/colors";
import { Box } from "@mui/material";
import React from "react";
import { useTaskContext } from "./Context";

export const Color = React.memo(function Color({ color }: { color: string }) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const task = useTaskContext();

  return (
    <Box
      sx={{
        width: "30px",
        flex: "0 0 30px",
        borderRadius: 9,
        height: "30px",
        display: "flex",
        ...(task.color === color && {
          boxShadow: `0 0 0 2px ${isDark ? "hsl(240,11%,20%)" : "#fff"} inset`,
        }),
        transition: "box-shadow .4s",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        background: `${colors[color]["400"]}!important`,
        border: "2px solid",
        borderColor: `${colors[color]["400"]}!important`,
        "&:hover": {
          borderColor: `${colors[color]["500"]}!important`,
          background: `${colors[color]["500"]}!important`,
        },
      }}
      onClick={() => task.edit(task.id, "color", color)}
    />
  );
});
