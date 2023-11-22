"use client";
import Page from "@/app/(app)/spaces/[id]/integrations/[integration]/page";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { SwipeableDrawer } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function Modal() {
  const { session } = useSession();
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SwipeableDrawer
      open={open}
      anchor="bottom"
      onClose={onDismiss}
      PaperProps={{
        sx: {
          maxHeight: "100dvh",
          maxWidth: { xs: "100dvw", sm: "500px" },
          height: { xs: "100dvh", sm: "calc(100% - 20px)" },
          my: { sm: "10px" },
          borderRadius: { xs: 0, sm: 5 },
          border: { sm: `2px solid ${palette[4]}!important` },
          boxShadow: `0px 0px 20px ${palette[4]}!important`,
        },
      }}
    >
      <Page />
    </SwipeableDrawer>
  );
}
