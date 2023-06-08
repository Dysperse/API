import { isEmail } from "@/components/Group/Members";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
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
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!isEmail(email)) {
      toast.error("Please enter an email", toastStyles);
      return;
    }
    router.push(`/users/${encodeURIComponent(email)}`);
  };

  return (
    <>
      <Box sx={profileCardStyles}>
        <Typography sx={profileCardStyles.heading}>Add friend</Typography>
        <TextField
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && handleSubmit()}
          placeholder="Type an email..."
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
      </Box>
    </>
  );
}
