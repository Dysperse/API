import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
export default function Tips() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "700" }}>
        Tips
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Coming soon!
      </Typography>
    </Box>
  );
}
