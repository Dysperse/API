"use client";
import { SpacesLayout } from "@/app/(app)/spaces/[id]/SpacesLayout";
import { SwipeableDrawer } from "@mui/material";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useCallback, useEffect } from "react";

export default function PhotoModal({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (onDismiss) onDismiss();
    },
    [onDismiss]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <SwipeableDrawer
      open
      anchor="bottom"
      onClose={onClick}
      PaperProps={{
        sx: { maxHeight: "calc(100dvh - 100px)" },
      }}
    >
      <SpacesLayout />
    </SwipeableDrawer>
  );
}
