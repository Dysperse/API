import { containerRef } from "@/app/container";
import { useEffect, useRef } from "react";
import { mutate } from "swr";

export const useOverscroll = (targetRef) => {
  const startYRef: any = useRef(null);

  useEffect(() => {
    const inbox = targetRef.current;

    const handleTouchStart = (e) => {
      startYRef.current = e.touches[0].pageY;
    };

    const handleTouchMove = (e) => {
      const y = e.touches[0].pageY;

      // Activate custom pull-to-refresh effects when at the top of the container
      // and user is scrolling up.
      if (
        containerRef.current.scrollTop === 0 &&
        y > startYRef.current &&
        !document.body.classList.contains("refreshing")
      ) {
        // refresh inbox.
        mutate(() => true);
      }
    };

    inbox.addEventListener("touchstart", handleTouchStart, { passive: true });
    inbox.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      inbox.removeEventListener("touchstart", handleTouchStart);
      inbox.removeEventListener("touchmove", handleTouchMove);
    };
  }, [targetRef]);

  // You can return any cleanup logic if needed.
};

export default useOverscroll;
