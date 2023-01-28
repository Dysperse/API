import { Button, ButtonGroup } from "@mui/material";
import { colors } from "../../../lib/colors";

export function OptionsGroup({ currentOption, setOption, options }) {
  return (
    <ButtonGroup
      variant="outlined"
      className="rounded-[0.75rem!important] p-0.5 -mb-5"
      sx={{
        width: "100%",
        gap: 0.2,
        background: `${
          global.user.darkMode ? "hsl(240,11%,20%)" : colors[themeColor][100]
        }!important`,
      }}
    >
      {options.map((option) => (
        <Button
          key={option}
          variant="contained"
          onClick={() => setOption(option)}
          className="w-1/2 rounded-[0.75rem!important] overflow-hidden transition-none whitespace-nowrap overflow-ellipsis border-2 px-5"
          sx={{
            transition: "none!important",
            background: `${
              global.user.darkMode
                ? "hsl(240,11%,30%)"
                : colors[themeColor][900]
            }!important`,

            color: global.user.darkMode ? "#fff" : colors[themeColor][0],
            ...(currentOption !== option && {
              background: `${
                global.user.darkMode
                  ? "hsl(240,11%,20%)"
                  : colors[themeColor][100]
              }!important`,
              "&:hover": {
                background: `${
                  global.user.darkMode
                    ? "hsl(240,11%,20%)"
                    : colors[themeColor][200]
                }!important`,
              },
              color: `${
                colors[themeColor][global.user.darkMode ? 50 : 900]
              }!important`,
            }),
          }}
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}
