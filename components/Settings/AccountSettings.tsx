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
              disabled
              variant="filled"
              defaultValue={global.user && global.user.email}
              label="Email"
              onBlur={(e) => updateSettings("email", e.target.value)}
            />
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={
            <TextField
              fullWidth
              variant="filled"
              defaultValue={global.user && global.user.image}
              label="Profile picture"
              onBlur={(e) => updateSettings("image", e.target.value)}
            />
          }
        />
      </ListItem>
    </Box>
  );
}
