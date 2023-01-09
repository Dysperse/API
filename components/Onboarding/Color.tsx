import { CardActionArea, Icon } from "@mui/material";
import { mutate } from "swr";
import { colors } from "../../lib/colors";
import { updateSettings } from "../Settings/updateSettings";

/**
 * Color component
 * @param {any} {color
 * @param {any} handleNext}
 * @returns {any}
 */
export function Color({ color, handleNext }) {
  return (
    <CardActionArea
      onClick={() => {
        if (color == "grey" || color == "white") {
          updateSettings("darkMode", color == "grey" ? "true" : "false");
        } else {
          updateSettings("color", color.toLowerCase());
        }
        mutate("/api/user");

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
            ? "hsl(240,11%,5%)!important"
            : color === "white"
            ? "#ddd !important"
            : colors[color]["A700"] + "!important",
      }}
    >
      {color === global.themeColor && (
        <Icon style={{ color: "#fff" }}>check</Icon>
      )}
    </CardActionArea>
  );
}
