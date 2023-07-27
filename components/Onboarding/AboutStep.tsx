import { Box, Button, Container, Typography } from "@mui/material";

export function AboutStep({ styles, navigation }) {
  return (
    <Box sx={styles.container}>
      <Container>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            mb: 1,
          }}
        >
          We&apos;re excited to have you here!
        </Typography>

        <Typography>
          It&apos;s time to redefine the standard for productivity.
        </Typography>
        <Button size="small" sx={{ mt: 2 }} onClick={() => navigation.set(5)}>
          Skip setup
        </Button>
      </Container>
    </Box>
  );
}
