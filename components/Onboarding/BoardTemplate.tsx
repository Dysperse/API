import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import {
  Box,
  CircularProgress,
  Icon,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

export function BoardTemplate({ template }) {
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  const [added, setAdded] = useState<boolean>(false);

  const handleClick = () => {
    setLoading(true);
    fetchRawApi(session, "property/boards/create", {
      board: JSON.stringify(template),
    }).then(async () => {
      setAdded(true);
      setLoading(false);
    });
  };

  return (
    <ListItemButton
      onClick={handleClick}
      key={template.name}
      disabled={added}
      sx={{ mt: 1, transition: "none" }}
    >
      <Box>
        <Box>
          <ListItemText primary={template.name} />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          {template.columns.map((column, index) => (
            <picture key={index}>
              <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                width="25px"
                height="25px"
                alt="emoji"
              />
            </picture>
          ))}
        </Box>
      </Box>
      {loading && <CircularProgress sx={{ ml: "auto" }} />}
      {added && <Icon sx={{ ml: "auto" }}>check_circle</Icon>}
    </ListItemButton>
  );
}
