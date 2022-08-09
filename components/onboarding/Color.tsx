import CardActionArea from "@mui/material/CardActionArea";
import * as colors from "@mui/material/colors";

export function Color({ color, setThemeColor }) {
  return (
    <CardActionArea
      onClick={() => setThemeColor(color)}
      sx={{
        width: 70,
        height: 70,
        borderRadius: 5,
        mr: 2,
        mt: 1,
        cursor: "pointer",
        display: "inline-block",
        background: colors[color]["700"],
      }}
    ></CardActionArea>
  );
}
