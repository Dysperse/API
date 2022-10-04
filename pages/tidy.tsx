import Box from "@mui/material/Box";
import { useState } from "react";
import { ErrorHandler } from "../components/ErrorHandler";
import { Header } from "../components/Tidy/Header";
import { useApi } from "../hooks/useApi";
import type { ApiResponse } from "../types/client";

/**
 * Top-level component for the maintenance page
 */
export default function Maintenance() {
  const { error, data }: ApiResponse = useApi("property/maintenance/reminders");

  const [step, setStep] = useState<number>(0);

  return (
    <Box sx={{ mb: 4 }}>
      <Header step={step} setStep={setStep} />
      <Box sx={{ p: 3 }}>
        {error && (
          <ErrorHandler
            error={"An error occured while trying to fetch your inventory."}
          />
        )}
      </Box>
    </Box>
  );
}
