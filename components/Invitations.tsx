import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { updateSettings } from "./Settings/updateSettings";
import toast from "react-hot-toast";

function Invitation({ t, invitation, key }: any) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <span>
        You have recieved a new invitation
        <Button
          variant="contained"
          sx={{
            mt: 1,
            borderRadius: 3,
            width: "100%",
            display: "flex",
            boxShadow: 0,
          }}
          onClick={() => {
            setOpen(true);
            toast.dismiss(t.id);
          }}
        >
          View
        </Button>
      </span>

      <Box sx={{ p: 4, textAlign: "left", py: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: "700" }}>
          A Carbon user has invited you to join &ldquo;{invitation.houseName}
          &rdquo;
        </Typography>
        <Typography sx={{ mt: 1 }} variant="body2">
          Joining a home will delete any items, budgets, or goals you&apos;ve
          created. You can restore it later by removing yourself. Once you join,
          you won&apos;t be able to recieve invitations from other users until
          you remove yourself from {invitation.houseName}.
        </Typography>
        <LoadingButton
          onClick={() => {
            setLoading(true);
            updateSettings("SyncToken", invitation.token, false, () => {
              setLoading(false);
              setOpen(false);
              window.location.reload();
            });
          }}
          loading={loading}
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            borderRadius: 5,
            boxShadow: 0,
            textTransform: "none",
            width: "100%",
            mx: "auto",
            maxWidth: "500px",
          }}
        >
          Join
        </LoadingButton>
      </Box>
    </>
  );
}

export function Invitations() {
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("https://api.smartlist.tech/v2/account/sync/invitations/", {
        method: "POST",
        body: new URLSearchParams({
          token: global.session && global.session.accessToken,
          email: global.session && global.session.user.email,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.data.length > 0) {
            res.data.forEach((invitation: any, key: number) => {
              toast((t) => <></>);
            });
          }
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* {data &&
        data.data &&
        data.data.map((invitation: any) => (
          <Invitation data={invitation} key={invitation.id} />
        ))} */}
    </>
  );
}
