import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button, Icon, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function ContactSync({ showFriends }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [show, setShow] = useState(false);

  const { data, error } = useSWR([
    "user/profile",
    {
      email: session.user.email,
    },
  ]);

  useEffect(() => {
    if (!localStorage.getItem("shouldShowSuggestions")) {
      if (showFriends || !data?.Profile?.google || !data?.Profile?.spotify) {
        setShow(true);
      }
    }
  }, []);

  return !show ? (
    <></>
  ) : (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          background: palette[2],
          borderRadius: 5,
          maxWidth: "500px",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
            borderBottom: `2px solid ${palette[3]}`,
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Icon sx={{ fontSize: "30px!important" }}>auto_awesome</Icon>
          <Typography variant="h6">Suggestions</Typography>

          <IconButton
            sx={{ ml: "auto", background: palette[3] }}
            onClick={() => {
              setShow(false);
              localStorage.setItem("shouldShowSuggestions", "false");
            }}
          >
            <Icon>close</Icon>
          </IconButton>
        </Box>
        <Box sx={{ p: 2, display: "flex", gap: 2, flexDirection: "column" }}>
          {showFriends && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Icon sx={{ mt: 2 }}>trip_origin</Icon>
              <Box>
                <Typography>
                  <b>Add your friends</b>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Quickly see anyone&apos;s availability
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    document.getElementById("addFriendTrigger")?.click()
                  }
                >
                  Add a friend
                </Button>
              </Box>
            </Box>
          )}
          {data && !data?.Profile?.google && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Icon sx={{ mt: 2 }}>trip_origin</Icon>
              <Box>
                <Typography>
                  <b>Connect your contacts</b>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Quickly find others you know
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  href="/api/user/google/redirect"
                >
                  Tap to sync
                </Button>
              </Box>
            </Box>
          )}
          {data && !data?.Profile?.spotify && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Icon sx={{ mt: 2 }}>trip_origin</Icon>
              <Box>
                <Typography>
                  <b>Link your Spotify account</b>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Show others what you&apos;re listening too
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  href="/api/user/google/redirect"
                >
                  Connect
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
