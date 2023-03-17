import { Icon, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { colors } from "../../lib/colors";
import { useSession } from "../../pages/_app";

export function UpdateButton() {
  const [button, setButton] = useState<boolean>(false);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      wb.addEventListener("installed", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("controlling", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("activated", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      const promptNewVersionAvailable = () => {
        setButton(true);
        wb.addEventListener("controlling", () => {
          window.location.reload();
        });
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);
      wb.addEventListener("message", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.register();
    }
  }, []);
  const session = useSession();

  return button ? (
    <Tooltip title="A newer version of this app is available. Click to download">
      <IconButton
        color="inherit"
        onClick={() => window.location.reload()}
        sx={{
          mr: -1,
          color: session.user.darkMode
            ? "hsl(240, 11%, 90%)"
            : colors.green[700],
          transition: "none !important",
          WebkitAppRegion: "no-drag",
        }}
      >
        <Icon className="rounded">download</Icon>
      </IconButton>
    </Tooltip>
  ) : null;
}
