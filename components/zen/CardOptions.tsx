import { Box, Icon, IconButton } from "@mui/material";
import { memo } from "react";

export const CardOptions = memo(function CardOptions({}: {}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        "& .MuiIconButton-root": {
          "& .MuiIcon-root": {
            fontSize: "20px!important",
          },
        },
      }}
    >
      <IconButton size="small">
        <Icon className="outlined">delete</Icon>
      </IconButton>
    </Box>
  );
});
