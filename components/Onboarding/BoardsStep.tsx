import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Container, Typography } from "@mui/material";
import { useRef } from "react";
import { CreateBoard } from "../Tasks/Board/Create";

export function BoardsStep({ styles, navigation }) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const parentRef = useRef();
  return (
    <Box sx={{ ...styles.container, overflow: "hidden" }} ref={parentRef}>
      <Container sx={{ mt: { sm: 20 } }}>
        <Typography variant="h1" className="font-heading" sx={styles.heading}>
          Create some boards
        </Typography>
        <Typography sx={styles.helper}>
          Boards are sweet places to plan almost anything, from your next
          vacation to your personal planner.
        </Typography>
        <CreateBoard onboarding parentRef={parentRef.current} />
      </Container>
    </Box>
  );
}
