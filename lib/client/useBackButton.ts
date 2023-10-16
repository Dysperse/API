import { useRouter } from "next/router";
import { useEffect } from "react";

export const useBackButton = ({ open, callback, hash }) => {
  const router = useRouter();

  useEffect(() => {
    if (open) {
      window.location.hash = hash;
    }

    router.beforePopState(() => {
      if (open) {
        callback();
        window.location.hash = "";
        return false;
      } else {
        window.location.hash = "";
        return true;
      }
    });
  }, [open, callback, router]);
};
