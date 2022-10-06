import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { MaintenanceReminder } from "@prisma/client";
import { ErrorHandler } from "../components/ErrorHandler";
import { Header } from "../components/Tidy/Header";
import { useApi } from "../hooks/useApi";
import type { ApiResponse } from "../types/client";
import { Button, LinearProgress } from "@mui/material";
import dayjs from "dayjs";

function Reminder({ data }: { data: MaintenanceReminder }) {
  const { lastDone, frequency, on } = data;
  let nextDue = new Date(lastDone);
  let days = 1;

  switch (frequency) {
    case "daily":
      // Add 1 day to now variable
      nextDue.setDate(nextDue.getDate() + 1);
      days = 1;
      break;
    case "weekly":
      // Add 7 days to now variable
      nextDue.setDate(nextDue.getDate() + 7);
      days = 7;
      break;
    case "monthly":
      // Add 1 month to now variable
      nextDue.setMonth(nextDue.getMonth() + 1);
      days = 30;
      break;
    case "every 6 months":
      // Add 6 months to now variable
      nextDue.setMonth(nextDue.getMonth() + 6);
      days = 180;
      break;
    case "yearly":
      // Add 1 year to now variable
      nextDue.setFullYear(nextDue.getFullYear() + 1);
      days = 365;
      break;
  }

  // Calculate days left until `nextDue` using dayjs
  const daysLeft = dayjs(nextDue).diff(dayjs(), "day");
  const daysLeftFromLastDone = dayjs(nextDue).diff(dayjs(lastDone), "day");

  // Make lastDone and nextDue a percentage
  const percent = (daysLeft / days) * 100;

  return (
    <Card
      sx={{
        background: "rgba(200,200,200,.3)",
        mb: 2,
        borderRadius: 5,
        "& *": {
          transition: "none",
        },
      }}
    >
      <CardActionArea>
        <CardContent sx={{ px: 4, py: 2 }}>
          <Typography gutterBottom variant="h6">
            {data.name}
          </Typography>
          <Typography gutterBottom variant="body1">
            <span
              style={{
                textTransform: "capitalize",
              }}
            >
              {data.frequency}
            </span>{" "}
            on {data.on}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {daysLeft} day{daysLeft !== 1 && "s"} remaining
          </Typography>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ mt: 2, borderRadius: 5, height: 9 }}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/**
 * Top-level component for the maintenance page
 */
export default function Maintenance() {
  const { error, data }: ApiResponse = useApi("property/tidy/reminders");

  return (
    <Box sx={{ mb: 4 }}>
      <Header />
      <Box sx={{ p: 3 }}>
        {data &&
          data.map((reminder) => (
            <Reminder key={reminder.id} data={reminder} />
          ))}
        {data && data.length === 0 && (
          <Box
            sx={{
              p: 3,
              background: "rgba(200, 200, 200, 0.3)",
              borderRadius: 5,
            }}
          >
            You don&apos;t have any reminders yet. Add one by clicking the
            button in the top right corner
          </Box>
        )}
        {error && (
          <ErrorHandler
            error={"An error occured while trying to fetch your items"}
          />
        )}
      </Box>
    </Box>
  );
}
