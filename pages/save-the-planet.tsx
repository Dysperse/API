import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import { blue } from "@mui/material/colors";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { CarbonFootprint } from "../components/save-the-planet/CarbonFootprint";
import { Donate } from "../components/save-the-planet/Donate";
import { EcoFriendlyGoals } from "../components/save-the-planet/EcoFriendlyGoals";
import { ItemSuggestions } from "../components/save-the-planet/ItemSuggestions";
import { Reminders } from "../components/save-the-planet/Reminders";
import { EcoFriendlyTips } from "../components/save-the-planet/Tips/EcoFriendlyTips";

export default function Render() {
  return (
    <>
      <Container sx={{ mt: 6 }}>
        <Typography
          variant="h3"
          sx={{
            my: { xs: 12, sm: 12 },
            fontWeight: "400",
            textAlign: { xs: "center", sm: "center" },
          }}
        >
          Sustainability
        </Typography>
        <Box sx={{ ml: 2, mt: 4 }}>
          <Masonry
            columns={{
              xs: 1,
              sm: 2,
            }}
            spacing={2}
          >
            <EcoFriendlyTips />
            <ItemSuggestions />
            <Reminders />
            <Donate />
            <CarbonFootprint />
            <EcoFriendlyGoals />
          </Masonry>
        </Box>
      </Container>
    </>
  );
}
