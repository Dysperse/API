import { updateSettings } from "./updateSettings";

import {
  Box,
  Link,
  ListItem,
  ListItemText,
  TextField,
  Typography,
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
            />
          }
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={
            <TextField
              InputProps={{
                readOnly: true,
              }}
              disabled
              sx={{ mb: 2 }}
              variant="filled"
              defaultValue={global.user && global.user.email}
              label="Email"
            />
          }
        />
      </ListItem>
      <Typography sx={{ mb: 3, px: 2 }}>
        If you want to deactivate your account,{" "}
        <Link href="mailto:hello@smartlist.tech">please contact us</Link>
      </Typography>
    </Box>
  );
}
