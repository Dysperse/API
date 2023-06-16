import { fetchRawApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import { Box, Icon, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const palette = useColor(session.themeColor, session.user.darkMode);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      if (success) {
        router.push(`/users/${session.user.email}`);
        return;
      }
      setLoading(true);
      await fetchRawApi("claim-esb");
      toast.success("Claimed!", toastStyles);
      setSuccess(true);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error(
        "Yikes! Something went wrong while trying to claim your badge. Please try again later.",
        toastStyles
      );
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        background: palette[2],
        transform: "translate(-50%, -50%)",
        p: 3,
        borderRadius: 5,
        maxWidth: "calc(100% - 20px)",
        width: "400px",
      }}
    >
      <Typography variant="h3" className="font-heading">
        {success ? "Claimed!" : "Claim your badge!"}
      </Typography>
      <Typography>
        {success
          ? "Tap the button below to see your fancy new badge!"
          : "Thanks for being an early supporter! Tap the button below to claim a special badge on your profile!"}
      </Typography>
      <LoadingButton
        onClick={handleSubmit}
        loading={loading}
        fullWidth
        variant="contained"
        size="large"
        sx={{ mt: 2 }}
      >
        {success ? "View badge" : "Claim"}
        <Icon>east</Icon>
      </LoadingButton>
    </Box>
  );
}
