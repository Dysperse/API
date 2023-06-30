import { useSession } from "@/lib/client/session";
import { CardActionArea, Icon, Tooltip } from "@mui/material";
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

  return (
    <Tooltip title={color} placement="top">
      <CardActionArea
        onClick={() => {
          if (color === "gray" || color === "sand") {
            updateSettings(
              session,
              "darkMode",
              color === "gray" ? "dark" : "light"
            );
          } else {
            updateSettings(session, "color", color.toLowerCase());
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
          background:
            colors[color] &&
            `linear-gradient(45deg, ${colors[color][color + 9]}, ${
              colors[color][color + 11]
            })`,
          justifyContent: "center",
          ...(color == "gray" && { background: `#000` }),
          ...(color == "sand" && { background: `#ccc` }),
        }}
      >
        {color === session?.themeColor && (
          <Icon style={{ color: color === "lime" ? "#000" : "#fff" }}>
            check
          </Icon>
        )}
      </CardActionArea>
    </Tooltip>
  );
}
