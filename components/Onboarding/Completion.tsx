import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { Box, Button, Icon, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export function Completion({ styles, navigation }) {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Box
      sx={{
        ...styles.container,
        textAlign: "center",
        alignItems: "center",
        gap: 1,
        height: "100vh",
        pt: 0,
      }}
    >
      <Typography variant="h1" className="font-heading" sx={styles.heading}>
        You&apos;re all set!
      </Typography>
      <Typography>
        You can always come back to this page by visiting your account settings
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setLoading(true);
            updateSettings(
              session,
              "onboardingComplete",
              "true",
              false,
              async () => {
                router.push((router.query.next as string) || "/");
              },
              false
            );
          }}
        >
          Let&apos;s go <Icon>east</Icon>
        </Button>
      </Box>
    </Box>
  );
}
