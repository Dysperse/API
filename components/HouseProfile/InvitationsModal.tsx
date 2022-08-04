import Box from "@mui/material/Box";
import useSWR from "swr";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Puller } from "../Puller";
import toast from "react-hot-toast";
import { updateSettings } from "../Settings/updateSettings";
import LoadingButton from "@mui/lab/LoadingButton";

function Invitation({ invitation }: any) {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <Box
      sx={{
        fontSize: "15px",
        my: 4,
        background: colors[themeColor][100],
        borderRadius: 5,
        display: "block",
        p: 2,
        px: 2.5,
        userSelect: "none",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "700" }}>
        {invitation.houseName}
      </Typography>
      <Typography
        sx={{
          textTransform: "capitalize",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          mb: 2,
          mt: 1,
          fontWeight: "600",
        }}
      >
        <span className="material-symbols-rounded">
          {invitation.houseType === "dorm"
            ? "cottage"
            : invitation.houseType === "apartment"
            ? "location_city"
            : "home"}
        </span>
        <span style={{ marginTop: "2px" }}>{invitation.houseType}</span>
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <LoadingButton
          loading={loading}
          variant="outlined"
          disabled={
            invitation.propertyToken ===
              global.session.property.propertyToken &&
            invitation.accepted === "true"
          }
          sx={{ width: "100%", borderWidth: "2px!important" }}
          onClick={() => {
            setLoading(true);
            fetch(
              "/api/account/sync/acceptInvitation?" +
                new URLSearchParams({
                  accessToken: invitation.accessToken,
                  email: global.session.account.email,
                })
            ).then((res) => {
              updateSettings("SyncToken", invitation.accessToken, false, () => {
                toast.success("Joined!");
                setLoading(false);
                window.location.href = "/dashboard";
                window.location.reload();
              });
            });
          }}
        >
          {invitation.propertyToken === global.session.property.propertyToken &&
          invitation.accepted === "true"
            ? "Joined"
            : "Join"}
        </LoadingButton>
      </Box>
    </Box>
  );
}
export function InvitationsModal() {
  const [open, setOpen] = React.useState(false);
  const url =
    "/api/account/sync/invitations?" +
    new URLSearchParams({
      token: global.session.account.accessToken,
      email: global.session.account.email,
    });

  const { data, error }: any = useSWR(url, () =>
    fetch(url, { method: "POST" }).then((res) => res.json())
  );
  return (
    <>
      <IconButton
        disableRipple
        onClick={() => setOpen(true)}
        sx={{
          color: "white",
          mr: 1,
        }}
      >
        <span className="material-symbols-rounded">groups</span>
      </IconButton>
      <SwipeableDrawer
        open={open}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            overflow: "scroll",
            maxHeight: "95vh",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        onClose={() => setOpen(false)}
        anchor="bottom"
        swipeAreaWidth={0}
      >
        <Puller />
        <Box sx={{ p: 4 }}>
          <Typography variant="h5">Invitations</Typography>
          <Box
            sx={{
              fontSize: "15px",
              my: 4,
              background: colors[themeColor][100],
              borderRadius: 5,
              display: "block",
              p: 2,
              userSelect: "none",
              textAlign: "center",
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{
                display: "block",
                marginBottom: "10px",
              }}
            >
              warning
            </span>
            <b>Heads up!</b> Once you join a home, you&apos;ll lose access to
            any items, lists, or tasks you&apos;ve created. Your finances
            won&apos;t be affected. Other members won&apos;t be able to view
            your budgets or transactions.
          </Box>
          {error && (
            <Box
              sx={{
                fontSize: "15px",
                my: 4,
                background: colors[themeColor][100],
                borderRadius: 5,
                display: "block",
                p: 2,
                userSelect: "none",
                textAlign: "center",
              }}
            >
              <span
                className="material-symbols-rounded"
                style={{
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                warning
              </span>
              An error occured while trying to fetch invitations
            </Box>
          )}
          {data ? (
            <>
              {data.data.map((invitation, key) => (
                <Invitation invitation={invitation} key={key} />
              ))}
            </>
          ) : (
            <Box
              sx={{
                fontSize: "15px",
                my: 4,
                background: colors[themeColor][100],
                borderRadius: 5,
                display: "block",
                p: 2,
                userSelect: "none",
                textAlign: "center",
              }}
            >
              <span
                className="material-symbols-rounded"
                style={{
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                warning
              </span>
              An error occured while trying to fetch invitations
            </Box>
          )}{" "}
        </Box>
      </SwipeableDrawer>
    </>
  );
}
