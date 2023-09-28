import { useSession } from "@/lib/client/session";
import { LoadingButton } from "@mui/lab";
import { Box, Icon, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";

export function Completion({ styles }) {
  const { session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Box
      sx={{
        ...styles.container,
        textAlign: "center",
        alignItems: "center",
        gap: 1,
        height: "100dvh",
        pt: 0,
      }}
    >
      <Typography variant="h1" className="font-heading" sx={styles.heading}>
        You&apos;re all set!
      </Typography>
      <Typography sx={{ maxWidth: "300px", textAlign: "center" }}>
        You can always come back to this page by visiting your account settings
      </Typography>
      <Box>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          onClick={async () => {
            setLoading(true);
            await mutate("/api/session");
            router.push((router.query.next as string) || "/");
          }}
        >
          Let&apos;s go <Icon>east</Icon>
        </LoadingButton>
      </Box>
    </Box>
  );
}
