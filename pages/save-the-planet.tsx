import { EcoFriendlyTips } from "../components/save-the-planet/EcoFriendlyTips";
import { Reminders } from "../components/save-the-planet/Reminders";
import { Thermostat } from "../components/save-the-planet/Thermostat";
import { Donate } from "../components/save-the-planet/Donate";
import { CarbonFootprint } from "../components/save-the-planet/CarbonFootprint";
import { ItemSuggestions } from "../components/save-the-planet/ItemSuggestions";
import { EcoFriendlyGoals } from "../components/save-the-planet/EcoFriendlyGoals";
import { RecyclingGuide } from "../components/save-the-planet/RecyclingGuide";
import Masonry from "@mui/lab/Masonry";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import { blue } from "@mui/material/colors";

export default function Render() {
  return (
    <>
      <Box sx={{ px: 3 }}>
        <Card
          sx={{
            mt: 3,
            borderRadius: 5,
            p: 2,
            color: "white",
            backgroundSize: "cover",
            background:
              "url(https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569__480.jpg)"
          }}
        >
          <CardContent>
            <Chip
              label="Event"
              sx={{
                color: "white",
                background: blue["A700"],
                px: 3,
                py: 0.3,
                mb: 2,
                height: "auto"
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: "800" }} gutterBottom>
              Smartlist carbon footprint awareness month
            </Typography>
            <Typography>
              This month, Smartlist encourages you to take your car out less and
              start biking!
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <EcoFriendlyTips />
      <Container sx={{ mt: 6 }}>
        <Masonry columns={2}>
          <ItemSuggestions />
          <Reminders />
          <Thermostat />
          <Donate />
          <CarbonFootprint />
          <RecyclingGuide />
          <EcoFriendlyGoals />
        </Masonry>
      </Container>
    </>
  );
}
