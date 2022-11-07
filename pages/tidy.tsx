import Box from "@mui/material/Box";
import { ErrorHandler } from "../components/error";
import { Header } from "../components/Tidy/Header";
import { Reminder } from "../components/Tidy/Reminder";
import { useApi } from "../hooks/useApi";
import type { ApiResponse } from "../types/client";

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
