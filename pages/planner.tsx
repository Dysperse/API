import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
/*import "@fullcalendar/common/main.css";
import Calendar from "../components/planner/Calendar";
*/
export default function Render() {
  return (
    <>
      {0===1 ? (
        <Container sx={{ mt: 5 }}>
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
