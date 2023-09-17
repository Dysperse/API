import { useSession } from "@/lib/client/session";
import { CardActionArea } from "@mui/material";
import * as colors from "@radix-ui/colors";
import { updateSettings } from "../../lib/client/updateSettings";

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
  const { session } = useSession();
  const invertColors = ["lime", "cyan", "green", "teal", "blue"].includes(
    color
  );

  const handleClick = async () => {
    await updateSettings(["color", color], { session, type: "property" });
    mutatePropertyData();
  };

  return (
    <CardActionArea
      onClick={handleClick}
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "inline-flex",
        mr: 1,
        mb: 1,
        backgroundColor: colors[color][color + "9"],
        "&:hover": {
          backgroundColor: colors[color][color + "10"],
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
