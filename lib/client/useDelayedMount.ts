import { useEffect, useState } from "react";

/**
 * Delays the unmount process by a given time
 * (useful for transitions, so that the modal/dialog/drawer content isn't abruptly hidden when it's closed and given a small duration for transitions to occur)
 *
 * @param condition Condition if the component should be mounted
 * @param timeout Time this component should stay mounted for (in milliseconds)
 * @returns {boolean}
 */
export const useDelayedMount = (condition: boolean, timeout: number) => {
  const [mounted, setMounted] = useState(condition);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        setMounted(condition);
      },
      condition ? 0 : timeout,
    );

    return () => clearTimeout(timeoutId);
  }, [condition, timeout]);

  return mounted;
};
