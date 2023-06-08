import "@mui/material/SwipeableDrawer";

declare module "@mui/material/SwipeableDrawer" {
  interface SwipeableDrawerProps {
    onOpen?: () => void;
  }
}
