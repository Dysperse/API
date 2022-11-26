import { colors } from "../../lib/colors";
import { ExploreGoals } from "./ExploreGoals";

export function MyGoals(): JSX.Element {
  return (
    <>
      <div
        className="p-4 rounded-2xl flex items-center max-w-xl select-none cursor-pointer active:scale-[.98] transition-transform active:transition-[0s]"
        style={{
          background: colors[themeColor][50],
          color: colors[themeColor][900],
        }}
      >
        <div>
          <h3 className="font-secondary font-bold">Today&apos;s routine</h3>
          <h4 className="font-sm font-light">7 tasks remaining</h4>
        </div>
        <span className="material-symbols-rounded ml-auto">arrow_forward</span>
      </div>

      <ExploreGoals />
    </>
  );
}
