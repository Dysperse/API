import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogContent, Icon, Link, Typography } from "@mui/material";
import { useState } from "react";
import { mutate } from "swr";

export default function TosModal() {
  const { session, setSession } = useSession();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Dialog open onClose={() => {}}>
        <DialogContent>
          <Typography variant="h3" className="font-heading">
            Hey there!
          </Typography>
          <Typography sx={{ mb: 1 }}>
            We&apos;ve updated our{" "}
            <Link
              href="https://blog.dysperse.com/terms-of-service"
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="https://blog.dysperse.com/privacy-policy"
              target="_blank"
            >
              Privacy Policy
            </Link>
            . Please agree in order to continue using the platform.
          </Typography>
          <LoadingButton
            variant="contained"
            fullWidth
            loading={loading}
            onClick={async () => {
              setLoading(true);
              await updateSettings(["agreeTos", "true"], {
                session,
                setSession,
                type: "user",
              });
              await mutate("/api/session");
              setLoading(false);
            }}
          >
            <Icon>check</Icon>I agree!
          </LoadingButton>
        </DialogContent>
      </Dialog>
    </>
  );
}
