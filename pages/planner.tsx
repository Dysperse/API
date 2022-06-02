import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "@fullcalendar/common/main.css";
import { CreatePlanner } from "../components/planner/CreatePlanner";
import Calendar from "../components/planner/Calendar.jsx";

export default function Render() {
  return (
    <>
      {process.env.NODE_ENV == "development" ? (
        <Container sx={{ mt: 5 }}>
          <CreatePlanner />
          <Typography variant="h5" sx={{ fontWeight: "800" }}>
            Planner
          </Typography>
          <br />
          <Calendar />
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
