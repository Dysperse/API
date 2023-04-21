import { CardActionArea } from "@mui/material";
import { colors } from "../../lib/colors";
import { updateSettings } from "../Settings/updateSettings";

/**
 * Color component for house profile
 * @param {any} {s
 * @param {any} color
 * @returns {any}
 */

export function Color({
  mutatePropertyData,
  s,
  color,
}: {
  mutatePropertyData: any;
  s: string;
  color: string;
}) {
  const invertColors = ["lime", "cyan", "green", "teal", "blue"].includes(
    color
  );

  return (
    <CardActionArea
      onClick={() => {
        updateSettings("color", color, false, null, true).then(() =>
          setTimeout(mutatePropertyData, 1000)
        );
      }}
      sx={{
        width: 36,
        height: 36,
        cursor: "unset",
        borderRadius: "50%",
        display: "inline-flex",
        mr: 1,
        mb: 1,
        backgroundColor: `${colors[color]["A700"]}!important`,
        "&:hover": {
          backgroundColor: `${colors[color]["800"]}!important`,
        },
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          color: invertColors ? "#000" : "#fff",
          margin: "auto",
          opacity: s === color ? 1 : 0,
        }}
      >
        check
      </span>
    </CardActionArea>
  );
}
