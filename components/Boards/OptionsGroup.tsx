import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { colors } from "../../lib/colors";

export function OptionsGroup({ currentOption, setOption, options }) {
  return (
    <ButtonGroup
      variant="outlined"
      className="rounded-[0.75rem!important] p-0.5 -mb-5"
      sx={{
        width: "100%",
        gap: 0.1,
        background: `${
          colors[themeColor][global.theme == "dark" ? 900 : 100]
        }!important`,
      }}
      aria-label="outlined primary button group"
    >
      {options.map((option) => (
        <Button
          variant="contained"
          disableElevation
          onClick={() => setOption(option)}
          className="w-1/2 rounded-[0.75rem!important] overflow-hidden transition-none whitespace-nowrap overflow-ellipsis border-2 px-5"
          sx={{
            transition: "none!important",
            background: `${
              colors[themeColor][global.theme == "dark" ? 50 : 900]
            }!important`,
            color: colors[themeColor][global.theme == "dark" ? 900 : 50],
            ...(currentOption !== option && {
              background: `${
                colors[themeColor][global.theme == "dark" ? 900 : 100]
              }!important`,
              color: `${
                colors[themeColor][global.theme == "dark" ? 50 : 900]
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
