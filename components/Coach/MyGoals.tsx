import Typography from "@mui/material/Typography";
import { colors } from "../../lib/colors";
import { ExploreGoals } from "./ExploreGoals";

export function MyGoals(): JSX.Element {
  return (
    <div>
      <div
        className="p-4 rounded-2xl flex items-center max-w-xl select-none cursor-pointer"
        style={{
          background: colors[themeColor][900],
          color: colors[themeColor][50],
        }}
      >
        <div>
          <Typography className="font-secondary font-bold">
            Finish today&apos;s goals
          </Typography>
          <Typography variant="body2">7 tasks remaining</Typography>
        </div>
        <span className="material-symbols-rounded ml-auto">arrow_forward</span>
      </div>

      <ExploreGoals />
    </div>
  );
}
