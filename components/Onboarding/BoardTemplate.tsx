import {
  Box,
  CircularProgress,
  Icon,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { fetchRawApi } from "../../lib/client/useApi";

export function BoardTemplate({ template }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  return (
    <ListItemButton
      onClick={() => {
        setLoading(true);
        fetchRawApi("property/boards/create", {
          board: JSON.stringify(template),
        }).then(async () => {
          setAdded(true);
          setLoading(false);
        });
      }}
      key={template.name}
      disabled={added}
      sx={{ mt: 1, transition: "none" }}
    >
      <Box>
        <Box>
          <ListItemText
            primary={template.name}
            secondary={template.description.replace("NEW: ", "")}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          {template.columns.map((column, index) => (
            <picture key={index}>
              <img src={column.emoji} width="25px" height="25px" alt="emoji" />
            </picture>
          ))}
        </Box>
      </Box>
      {loading && <CircularProgress sx={{ ml: "auto" }} />}
      {added && <Icon sx={{ ml: "auto" }}>check_circle</Icon>}
    </ListItemButton>
  );
}
