import { updateSettings } from "./updateSettings";

import {
  Alert,
  Box,
  Link,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";

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
              variant="filled"
              defaultValue={global.user && global.user.name}
              label="Name"
              onBlur={(e) => updateSettings("name", e.target.value)}
              onKeyDown={(e: any) => {
                if (e.key == "Enter") e.target.blur();
              }}
            />
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={
            <TextField
              disabled
              sx={{ mb: 2 }}
              variant="filled"
              defaultValue={global.user && global.user.email}
              label="Email"
            />
          }
        />
      </ListItem>
      <Alert sx={{ mb: 3, px: 2 }} severity="info">
        If you want to deactivate your account,{" "}
        <Link href="mailto:hello@dysperse.com" target="_blank">
          please contact us
        </Link>
      </Alert>
    </Box>
  );
}
