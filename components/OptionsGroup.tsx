import { Button, ButtonGroup } from "@mui/material";
import { useSession } from "../lib/client/useSession";

export function OptionsGroup({ currentOption, setOption, options }) {
  const session = useSession();

  return (
    <ButtonGroup
      variant="outlined"
      className="-mb-5 rounded-[0.75rem!important] p-0.5"
      sx={{
        width: "100%",
        gap: 0.2,
        background: `hsl(240,11%,${
          session.user.darkMode ? 20 : 90
        }%)!important`,
      }}
    >
      {options.map((option) => (
        <Button
          key={option}
          variant="text"
          onClick={() => setOption(option)}
          onMouseDown={() => setOption(option)}
          className="w-1/2 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-[0.75rem!important] border-2 px-5 transition-none"
          sx={{
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
