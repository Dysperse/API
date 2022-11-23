import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Calendar } from "../components/Coach/Calendar";
import React from "react";
import { goals } from "../components/Coach/goalTemplates";
import { MyGoals } from "../components/Coach/MyGoals";

export default function Render() {
  return (
    <Box sx={{ pb: 3 }}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            background: "linear-gradient(-45deg, #715DF2 0%, #001122 50%)",
            p: 3,
            mt: 3,
            borderRadius: 5,
            color: "#fff",
          }}
        >
          <Typography variant="h6">
            Reach big goals with small steps.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 500,
            }}
          >
            Carbon coach helps you to reach your goals by breaking them down
            into small steps. Enrich your daily routine with new knowledge and
            skills to accelerate your growth.
          </Typography>
        </Box>
      </Box>
      <Calendar />
      <Box sx={{ px: 3 }}>
        <MyGoals />
      </Box>
    </Box>
  );
}
