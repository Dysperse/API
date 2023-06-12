import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { CardActionArea, Icon } from "@mui/material";
import * as colors from "@radix-ui/colors";
import { mutate } from "swr";
import { updateSettings } from "../../lib/client/updateSettings";

/**
 * Color component
 * @param {any} {color
 * @param {any} handleNext}
 * @returns {any}
 */
export function Color({ color, handleNext }) {
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);

  return (
    <CardActionArea
      onClick={() => {
        if (color === "grey" || color === "white") {
          updateSettings("darkMode", color === "grey" ? "true" : "false");
        } else {
          updateSettings("color", color.toLowerCase());
        }
        mutate("/api/session");
        handleNext();
      }}
      sx={{
        width: 30,
        height: 30,
        borderRadius: 5,
        mr: 2,
        mt: 1,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors[color][color + 9],
      }}
    >
      {color === session?.themeColor && (
        <Icon style={{ color: color === "lime" ? "#000" : "#fff" }}>check</Icon>
      )}
    </CardActionArea>
  );
}
