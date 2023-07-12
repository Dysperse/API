import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Container, Typography } from "@mui/material";
import { CreateBoard } from "../Tasks/Board/Create";

export function BoardsStep({ styles, navigation }) {
  const session = useSession();
  const isDark = useDarkMode(session.user.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    <Box sx={{ ...styles.container, overflow: "hidden" }}>
      <Container sx={{ mt: 20 }}>
        <Typography variant="h1" className="font-heading" sx={styles.heading}>
          Create some boards
        </Typography>
        <Typography sx={styles.helper}>
          Boards are sweet places to plan almost anything, from your next
          vacation to your personal planner.
        </Typography>
        <CreateBoard onboarding />
      </Container>
    </Box>
  );
}