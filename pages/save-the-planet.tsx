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
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { blue } from "@mui/material/colors";

export default function Render() {
  return (
    <>
      <Container fixed>
        <Card
          sx={{
            mt: 3,
            borderRadius: 5,
            p: 2,
            color: "white",
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://www.kibacapital.com/wp-content/uploads/2018/05/banner-space.jpg)",
            backgroundSize: "cover"
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
      </Container>
      <EcoFriendlyTips />
      <Container sx={{ mt: 6 }} fixed>
        <Masonry columns={2} spacing={2}>
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
