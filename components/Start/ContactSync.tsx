import { useSession } from "@/lib/client/session";
import { Alert, Typography } from "@mui/material";
import { motion } from "framer-motion";
import useSWR from "swr";

export default function ContactSync() {
  const { session } = useSession();
  const { data, error } = useSWR([
    "user/profile",
    {
      email: session.user.email,
    },
  ]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {data && !data?.Profile?.google && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            cursor: "pointer",
            "&:active": { transform: "scale(.96)" },
            transition: "all .2s",
          }}
          onClick={() => (window.location.href = "/api/user/google/redirect")}
        >
          <Typography variant="h6">Find others you know</Typography>
          <Typography variant="body2">Tap to sync your contacts</Typography>
        </Alert>
      )}
      {data && !data?.Profile?.spotify && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            cursor: "pointer",
            "&:active": { transform: "scale(.96)" },
            transition: "all .2s",
          }}
          onClick={() => (window.location.href = "/api/user/spotify/redirect")}
        >
          <Typography variant="h6">
            Let others know what you&apos;re listening to
          </Typography>
          <Typography variant="body2">
            Tap to connect your Spotify account
          </Typography>
        </Alert>
      )}
    </motion.div>
  );
}
