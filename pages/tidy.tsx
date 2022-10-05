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
  const { error, data }: ApiResponse = useApi("property/tidy/reminders");

  const [step, setStep] = useState<number>(-1);
  const [room, setRoom] = useState<string>("");

  return (
    <Box sx={{ mb: 4 }}>
      <Header step={step} setStep={setStep} />
      <Box sx={{ p: 3 }}>Hi</Box>
      {data && data.map((reminder) => <p>{reminder}</p>)}
      {error && (
        <ErrorHandler
          error={"An error occured while trying to fetch your items"}
        />
      )}
    </Box>
  );
}
