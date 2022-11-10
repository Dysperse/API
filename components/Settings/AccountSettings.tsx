import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { updateSettings } from "./updateSettings";

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
