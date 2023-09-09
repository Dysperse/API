import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Button, ButtonGroup } from "@mui/material";

export function OptionsGroup({
  currentOption,
  setOption,
  options,
  sx = {},
}: {
  currentOption: any;
  setOption: any;
  options: string[];
  sx?: any;
}) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    <ButtonGroup
      variant="outlined"
      sx={{
        p: 0.4,
        mb: -1,
        width: "100%",
        borderRadius: "15px!important",
        gap: 0.2,
        background: `${palette[3]}!important`,
        ...sx,
      }}
    >
      {options.map((option) => (
        <Button
          disableRipple
          key={option}
          fullWidth
          variant="text"
          onClick={() => setOption(option)}
          onMouseDown={() => setOption(option)}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            borderRadius: "15px!important",
            transition: "none!important",
            background: `${palette[9]}!important`,
            "&:hover": {
              background: `${palette[10]}!important`,
            },
            color: isDark ? "#000" : "#fff",
            cursor: "default",
            ...(currentOption !== option && {
              background: `${palette[3]}!important`,
              "&:hover": {
                background: `${palette[4]}!important`,
              },
              color: `${palette[11]}!important`,
            }),
          }}
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}
