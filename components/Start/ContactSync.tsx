import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button, Icon, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function ContactSync({ showFriends }) {
  const router = useRouter();

  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [show, setShow] = useState(false);

  const { data, error } = useSWR([
    "user/profile",
    { email: session.user.email },
  ]);

  const [showAvailability, setShowAvailability] = useState(true);

  useEffect(() => {
    localStorage.getItem("shouldShowSuggestions");
    localStorage.getItem("showAvailability");
    setTimeout(() => {
      if (localStorage.getItem("showAvailability")) {
        setShowAvailability(false);
      }
      if (localStorage.getItem("shouldShowSuggestions") !== "true") {
        if (
          data &&
          (showFriends || !data?.Profile?.google || !data?.Profile?.spotify)
        ) {
          setShow(true);
        }
      }
    });
  }, [data, showFriends]);

  return !show ? (
    <></>
  ) : showFriends || !data?.Profile?.google || !data?.Profile?.spotify ? (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          border: "2px solid",
          borderColor: palette[4],
          borderRadius: 5,
          mx: "auto",
          mb: 4,
          mt: { xs: 2, sm: 0 },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
            borderBottom: `2px solid ${palette[4]}`,
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Icon sx={{ fontSize: "30px!important" }}>auto_awesome</Icon>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              WELCOME TO DYSPERSE
            </Typography>
            <Typography variant="h6">Let&apos;s get started!</Typography>
          </Box>

          <IconButton
            sx={{ ml: "auto", background: palette[3] }}
            onClick={() => {
              setShow(false);
              toast(
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  Dismissed
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      localStorage.setItem("shouldShowSuggestions", "false");
                      setShow(true);
                      toast.dismiss();
                    }}
                  >
                    Undo
                  </Button>
                </Box>
              );
              localStorage.setItem("shouldShowSuggestions", "true");
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

          {showAvailability && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Icon sx={{ mt: 2 }}>trip_origin</Icon>
              <Box>
                <Typography>
                  <b>Check out Dysperse Availability</b>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Find the best time to meet with your friends
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    localStorage.setItem("showAvailability", "true");
                    router.push("/availability");
                  }}
                >
                  Try now
                </Button>
              </Box>
            </Box>
          )}
          {!data.picture && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Icon sx={{ mt: 2 }}>trip_origin</Icon>
              <Box>
                <Typography>
                  <b>Complete your profile</b>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Add your photo so others know who you are
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => router.push("/settings/profile")}
                >
                  Try now
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  ) : (
    <></>
  );
}
