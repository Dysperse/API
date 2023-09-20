import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Icon,
  InputAdornment,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function SearchFriend({ mutate }) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const addFriend = async () => {
    try {
      const data = await fetchRawApi(session, "user/followers/follow", {
        followerEmail: session.user.email,
        followingEmail: query,
      });
      console.log(data);
      if (!data?.success) throw new Error();
      toast.success("Added friend!");
      setOpen(false);
      mutate();
    } catch (e) {
      toast.error(
        "Hmm... That didn't work. Make sure you typed the email or username correctly."
      );
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
          setTimeout(
            () => document.getElementById("searchFriend")?.focus(),
            50
          );
        }}
      >
        <Icon className="outlined">search</Icon>
      </Button>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{
          sx: {
            border: `2px solid ${addHslAlpha(palette[3], 0.7)}`,
            borderRadius: 5,
            m: 2,
            mx: { xs: 2, sm: "auto" },
          },
        }}
      >
        <Puller showOnDesktop />
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            autoFocus
            fullWidth
            value={query}
            id="searchFriend"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Email or username..."
            InputProps={{
              autoFocus: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>alternate_email</Icon>
                </InputAdornment>
              ),
            }}
          />
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            fullWidth
            disabled={query.trim().length === 0}
            onClick={addFriend}
          >
            Add
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
