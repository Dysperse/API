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
        className="p-4 rounded-2xl flex items-center max-w-xl"
        sx={{
          background: colors[themeColor][900] + "!important",
          color: colors[themeColor][50],
        }}
      >
        <Box>
          <Typography className="font-secondary font-bold">
            Finish today&apos;s goals
          </Typography>
          <Typography variant="body2">7 tasks remaining</Typography>
        </Box>
        <span className="material-symbols-rounded ml-auto">arrow_forward</span>
      </CardActionArea>

      <ExploreGoals />
    </Box>
  );
}
