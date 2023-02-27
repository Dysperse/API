import { Button, ButtonGroup } from "@mui/material";

export function OptionsGroup({ currentOption, setOption, options }) {
  return (
    <ButtonGroup
      variant="outlined"
      className="-mb-5 rounded-[0.75rem!important] p-0.5"
      sx={{
        width: "100%",
        gap: 0.2,
        background: `${
          global.user.darkMode ? "hsl(240,11%,20%)" : "hsl(240,11%,90%)"
        }!important`,
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
            background: global.user.darkMode
              ? "hsl(240,11%,80%)!important"
              : "hsl(240,11%,20%)!important",
            color: global.user.darkMode ? "#000" : "#fff",
            ...(currentOption !== option && {
              background: `${
                global.user.darkMode ? "hsl(240,11%,20%)" : "hsl(240,11%,90%)"
              }!important`,
              "&:hover": {
                background: `${
                  global.user.darkMode ? "hsl(240,11%,20%)" : "hsl(240,11%,90%)"
                }!important`,
              },
              color: `#303030 !important`,
            }),
          }}
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}
