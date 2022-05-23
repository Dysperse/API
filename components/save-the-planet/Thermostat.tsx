import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export function Thermostat() {
  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: "800", mb: 2 }}>
        Thermostat
      </Typography>
      <Card
        sx={{
          width: "100%",
          p: 1,
          mb: 2,
          borderRadius: 5,
          background: "rgba(200,200,200,.3)"
        }}
      >
        <CardContent>
          <Typography>Coming soon!</Typography>
        </CardContent>
      </Card>
    </div>
  );
}
