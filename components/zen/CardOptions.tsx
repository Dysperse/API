import { Box, Icon, IconButton } from "@mui/material";
import { memo } from "react";

export const CardOptions = memo(function CardOptions({ items, setItems }: any) {
  const handleDelete = () => {
    setItems(items.filter(item => item !== option.name))
  }
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
      <IconButton size="small" onClick={handleDelete}>
        <Icon className="outlined">delete</Icon>
      </IconButton>
    </Box>
  );
});
