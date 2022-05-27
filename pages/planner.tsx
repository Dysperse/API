import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Render() {
  return (
    <>
      {process.env.NODE_ENV == "development" ? (
        <Container sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: "800" }}>
            Planner
          </Typography>
        </Container>
      ) : (
        <Box
          sx={{
            p: 3,
            mt: 5,
            mx: "auto",
            maxWidth: "calc(100vw - 50px)",
            borderRadius: 5,
            width: "500px",
            background: "rgba(200,200,200,.3)",
          }}
        >
          Coming soon!
        </Box>
      )}
    </>
  );
}
