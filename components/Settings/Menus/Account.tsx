import { Alert, Box, Button, Link, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import { useSession } from "../../../lib/client/useSession";
import { updateSettings } from "../updateSettings";

/**
 * Top-level component for the account settings page.
 */
export default function AppearanceSettings() {
  const session = useSession();
  const [name, setName] = useState(session.user.name);
  const handleChange = useCallback((e) => setName(e.target.value), [setName]);

  const handleSubmit = () => {
    if (name.trim() !== "") updateSettings("name", name);
  };

  return (
    <Box>
      <TextField
        onKeyDown={(e) => e.stopPropagation()}
        variant="filled"
        label="Name"
        fullWidth
        value={name}
        onChange={handleChange}
        margin="dense"
      />
      <TextField
        disabled
        sx={{ mb: 2 }}
        variant="filled"
        defaultValue={session?.user && session.user.email}
        label="Email"
        margin="dense"
      />
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ ml: "auto" }}
          disabled={
            session.user.name.trim() === name.trim() ||
            name.trim() === "" ||
            name.length > 40
          }
        >
          Save
        </Button>
      </Box>
      <Alert sx={{ my: 3, px: 2 }} severity="info">
        If you want to deactivate your account,{" "}
        <Link href="mailto:hello@dysperse.com" target="_blank">
          please contact us
        </Link>
      </Alert>
    </Box>
  );
}
