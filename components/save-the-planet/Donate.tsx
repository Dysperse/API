import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export function Donate() {
  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: "800", mb: 2 }}>
        Donate
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
    </div>
  );
}
