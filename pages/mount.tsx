import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useDelayedMount } from "../lib/client/useDelayedMount";

export default function App() {
  const [open, setOpen] = useState(false);
  const mount = useDelayedMount(open, 1000);

  return (
    <>
      <Button onClick={() => setOpen(!open)}>Toggle</Button>
      <Box sx={{ p: 3, background: "red" }}>{open ? "open" : "closed"}</Box>
      {mount && <Box sx={{ p: 3, background: "green" }}>Mounted!</Box>}
    </>
  );
}
