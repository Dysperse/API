import { Box, Button, Container, Typography } from "@mui/material";

export function AboutStep({ styles, navigation }) {
  return (
    <Box sx={styles.container}>
      <Container>
        <Typography
          className="font-heading"
          variant="h2"
          sx={{
            mb: 1,
            
          }}
        >
          It&apos;s time to redefine the standard for productivity.
        </Typography>

        <Typography>
          We&apos;re so excited to have you here. Let&apos;s get started
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
          onClick={() => navigation.set(5)}
        >
          Skip setup
        </Button>
      </Container>
    </Box>
  );
}
