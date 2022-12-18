import { updateSettings } from "./updateSettings";

import { Box, ListItem, ListItemText, TextField } from "@mui/material";

/**
 * Top-level component for the account settings page.
 */
export default function AppearanceSettings() {
  return (
    <Box>
      <ListItem>
        <ListItemText
          primary={
            <TextField
              fullWidth
              variant="filled"
              defaultValue={global.user && global.user.name}
              label="Name"
              onBlur={(e) => updateSettings("name", e.target.value)}
            />
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={
            <TextField
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 5 }}
              variant="filled"
              defaultValue={global.user && global.user.email}
              label="Email"
            />
          }
        />
      </ListItem>
    </Box>
  );
}
