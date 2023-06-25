import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import useDarkMode from "@/lib/client/useTheme";
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
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <ButtonGroup
      variant="outlined"
      sx={{
        p: 0.4,
        mb: -1,
        width: "100%",
        borderRadius: "15px!important",
        gap: 0.2,
        background: `${palette[5]}!important`,
        ...sx,
      }}
    >
      {options.map((option) => (
        <Button
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
            color: session.user.darkMode ? "#000" : "#fff",
            cursor: "default",
            ...(currentOption !== option && {
              background: `${palette[5]}!important`,
              "&:hover": {
                background: `${palette[6]}!important`,
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
