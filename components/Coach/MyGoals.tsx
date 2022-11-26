import { colors } from "../../lib/colors";
import { ExploreGoals } from "./ExploreGoals";
import Box from "@mui/material/Box";

export function MyGoals(): JSX.Element {
  return (
    <>
      <Box
        className="p-4 rounded-2xl flex items-center max-w-xl select-none cursor-pointer"
        sx={{
          background: colors[themeColor][50],
          "&:hover": {
            background: colors[themeColor][100],
          },
          color: colors[themeColor][900],
        }}
      >
        <div>
          <h3 className="font-secondary font-bold">Today&apos;s routine</h3>
          <h4 className="font-sm font-light">7 tasks remaining</h4>
        </div>
        <span className="material-symbols-rounded ml-auto">arrow_forward</span>
      </Box>

      <ExploreGoals />
    </>
  );
}
