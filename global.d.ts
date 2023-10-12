import "@mui/material/Icon";
import "@mui/material/SwipeableDrawer";

declare module "@mui/material/SwipeableDrawer" {
  interface SwipeableDrawerProps {
    onOpen?: () => void;
    variant?: "permanent" | "persistent" | "temporary" | "outlined" | undefined;
  }
}
