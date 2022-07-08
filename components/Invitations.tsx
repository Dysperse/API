import useSWR from "swr";
import { useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function Invitation({ data, key }: any) {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <SwipeableDrawer
      open={open}
      anchor="bottom"
      swipeAreaWidth={0}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      sx={{
        display: "flex",
        alignItems: { xs: "end", sm: "center" },
        height: "100vh",
        justifyContent: "center",
      }}
      PaperProps={{
        sx: {
          borderRadius: "28px",
          borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
          borderBottomRightRadius: { xs: 0, sm: "28px!important" },
          position: "unset",
          mx: "auto",
          maxWidth: { sm: "30vw", xs: "100vw" },
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ p: 4, textAlign: "left", py: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: "700" }}>
          You're invited to join {data.houseName} by another Carbon user
        </Typography>
        <Typography sx={{ mt: 1 }} variant="body2">
          Joining a home will delete your inventory. You can restore it later by
          removing yourself.
        </Typography>
        <Button
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
        </Button>
      </Box>
    </SwipeableDrawer>
  );
}
export function Invitations() {
  const url = "https://api.smartlist.tech/v2/account/sync/invitations/";
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken,
        email: global.session && global.session.user.email,
      }),
    }).then((res) => res.json())
  );

  return (
    <>
      {data &&
        data.data &&
        data.data.map((invitation: any) => (
          <Invitation data={invitation} key={invitation.id} />
        ))}
    </>
  );
}
