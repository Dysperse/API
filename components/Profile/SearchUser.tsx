import { isEmail } from "@/components/Group/Members";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Dialog,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function SearchUser({ profileCardStyles, data }) {
  const router: any = useRouter();
  const [email, setEmail] = useState(router.query.id || "");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!isEmail(email)) {
      toast.error("Please enter an email", toastStyles);
      return;
    }
    router.push(`/users/${encodeURIComponent(email)}`);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { p: 3 } }}
      >
        <Typography>Search</Typography>
        <TextField
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && handleSubmit()}
          placeholder="Type an email..."
          sx={{ flexGrow: 1, maxWidth: "300px", mx: "auto" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSubmit} disabled={!isEmail(email)}>
                  <Icon>east</Icon>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Dialog>
      <IconButton onClick={() => setOpen(true)}>
        <Icon>search</Icon>
      </IconButton>
    </>
  );
}
