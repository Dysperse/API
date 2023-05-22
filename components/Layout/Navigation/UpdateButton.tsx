import { CircularProgress, Icon, IconButton, Snackbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export function UpdateButton() {
  const ref: any = useRef();
  const [button, setButton] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as any).workbox !== undefined
    ) {
      const wb: any = (window as any).workbox;
      wb.addEventListener("installed", () => {});
      wb.addEventListener("controlling", () => {});
      wb.addEventListener("activated", () => {});

      const promptNewVersionAvailable = () => {
        setButton(true);
        // setTimeout(() => {
        if (!ref.current) return;
        alert("Updating...");
        ref.current.onClick = () => {
          setLoading(true);
          wb.addEventListener("controlling", () => {
            window.location.reload();
            setLoading(false);
          });
          wb.messageSkipWaiting();
        };
        //  }, 100);
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);

      wb.addEventListener("message", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });
      wb.register();
    }
  }, []);

  return button ? (
    <Snackbar
      open={true}
      autoHideDuration={6000}
      onClose={() => null}
      sx={{ mb: { xs: 7, sm: 2 }, transition: "all .3s" }}
      message="A newer version of Dysperse is available."
      action={
        <>
          <IconButton ref={ref} size="small">
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              <Icon sx={{ color: "#fff" }}>download</Icon>
            )}
          </IconButton>
          {!loading && (
            <IconButton onClick={() => setButton(false)} size="small">
              <Icon sx={{ color: "#fff" }}>close</Icon>
            </IconButton>
          )}
        </>
      }
    />
  ) : null;
}
