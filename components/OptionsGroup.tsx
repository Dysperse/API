import { useSession } from "@/lib/client/useSession";
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

  return (
    <ButtonGroup
      variant="outlined"
      sx={{
        p: 0.4,
        mb: -1,
        width: "100%",
        borderRadius: "15px!important",
        gap: 0.2,
        background: `hsl(240,11%,${
          session.user.darkMode ? 20 : 90
        }%)!important`,
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
            background: `hsl(240,11%,${
              session.user.darkMode ? 80 : 20
            }%)!important`,
            color: session.user.darkMode ? "#000" : "#fff",
            ...(currentOption !== option && {
              background: `hsl(240,11%,${
                session.user.darkMode ? 20 : 90
              }%) !important`,
              "&:hover": {
                background: `hsl(240,11%,${
                  session.user.darkMode ? 20 : 90
                }%)!important`,
              },
              color: session.user.darkMode
                ? "hsl(240,11%,80%) !important"
                : "#303030 !important",
            }),
          }}
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}
