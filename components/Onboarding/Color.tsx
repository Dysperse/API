import { colors } from "../../lib/colors";
import { updateSettings } from "../Settings/updateSettings";
import { CardActionArea } from '@mui/material';

/**
 * Color component
 * @param {any} {color
 * @param {any} setThemeColor
 * @param {any} handleNext}
 * @returns {any}
 */
export function Color({ color, setThemeColor, handleNext }) {
  return (
    <CardActionArea
      onClick={() => {
        if (color == "grey" || color == "white") {
          updateSettings("darkMode", color == "grey" ? "true" : "false");
        } else {
          updateSettings("color", color.toLowerCase());
        }

        // setThemeColor(color);
        handleNext();
      }}
      sx={{
        width: 40,
        height: 40,
        borderRadius: 5,
        mr: 2,
        mt: 1,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          color === "grey"
            ? "hsl(240,11%,5%)"
            : color === "white"
            ? "#eee"
            : colors[color]["700"],
      }}
    >
      {color === global.themeColor && (
        <span className="material-symbols-rounded" style={{ color: "#fff" }}>
          check
        </span>
      )}
    </CardActionArea>
  );
}
