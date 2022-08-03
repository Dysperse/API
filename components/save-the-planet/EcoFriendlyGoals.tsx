import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export function EcoFriendlyGoals() {
  return (
    <div>
      <Card
        sx={{
          p: 1,
          mb: 2,
          width: "100%",
          borderRadius: 5,
          background: "rgba(200,200,200,.3)",
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "700", mb: 2 }}>
            Goals
          </Typography>
          <Typography>Coming soon!</Typography>
        </CardContent>
      </Card>
    </div>
  );
}
