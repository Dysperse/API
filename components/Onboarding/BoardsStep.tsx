import { Box, Container, Typography } from "@mui/material";
import { CreateBoard } from "../Tasks/Board/Create";

export function BoardsStep({ parentRef, styles }) {
  return (
    <Box sx={{ ...styles.container, overflow: "hidden" }}>
      <Container sx={{ mt: { sm: 20 }, mb: 10 }}>
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
