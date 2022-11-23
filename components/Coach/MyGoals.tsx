import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import React from "react";
import { ExploreGoals } from "./ExploreGoals";
import { colors } from "../../lib/colors";

export function MyGoals(): JSX.Element {
  return (
    <Box>
      <CardActionArea
        sx={{
          background: colors[themeColor][50],
          color: colors[themeColor][900],
          p: 2,
          my: 4,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          maxWidth: "500px",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "600" }} className="font-secondary">
            Finish today&apos;s goals
          </Typography>
          <Typography variant="body2">7 tasks remaining</Typography>
        </Box>
        <span
          className="material-symbols-rounded"
          style={{
            marginLeft: "auto",
          }}
        >
          arrow_forward
        </span>
      </CardActionArea>

      <ExploreGoals />
    </Box>
  );
}
