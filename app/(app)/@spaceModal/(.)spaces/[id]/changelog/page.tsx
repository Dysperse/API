"use client";
import Page from "@/app/(app)/spaces/[id]/changelog/page";
import { SwipeableDrawer } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function Modal() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SwipeableDrawer
      open={open}
      anchor="bottom"
      onClose={onDismiss}
      PaperProps={{
        sx: { maxHeight: "calc(100dvh - 100px)" },
      }}
    >
      <Page />
    </SwipeableDrawer>
  );
}
