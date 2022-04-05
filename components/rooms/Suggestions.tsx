import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export function Suggestions() {
  const router = useRouter();
  const { index }: any = router.query;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ textTransform: "capitalize", mb: 1 }}>
          Suggestions for {index}
        </Typography>
        <Stack spacing={1} direction="row">
          <Chip label="Chip" />
          <Chip label="Chip" />
          <Chip label="Chip" />
          <Chip label="Chip" />
        </Stack>
      </CardContent>
    </Card>
  );
}
