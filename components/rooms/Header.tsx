import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export function Header() {
  const router = useRouter();
  const { index } = router.query;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
          {index}
        </Typography>
        <Typography variant="subtitle1">69 items</Typography>
      </CardContent>
    </Card>
  );
}
