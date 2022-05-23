import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export function CarbonFootprint() {
  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: "800", mb: 2 }}>
        Carbon footprint
      </Typography>
      <Card
        sx={{
          p: 1,
          mb: 2,
          width: "100%",
          borderRadius: 5,
          background: "rgba(200,200,200,.3)"
        }}
      >
        <CardContent>
          <Typography>Coming soon!</Typography>
        </CardContent>
      </Card>
    </>
  );
}
