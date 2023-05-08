import LoadingButton from "@mui/lab/LoadingButton";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useDeferredValue, useState } from "react";
import toast from "react-hot-toast";
import { isEmail } from ".";
import { fetchRawApi } from "../../../lib/client/useApi";
import { useBackButton } from "../../../lib/client/useBackButton";
import { Puller } from "../../Puller";
import { Prompt } from "../../TwoFactorModal";

import {
  Alert,
  Box,
  Button,
  FormControl,
  Icon,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "../../../lib/client/useSession";
import { toastStyles } from "../../../lib/client/useTheme";

function LinkToken() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [token, setToken] = React.useState("");
  const url = `https://${window.location.hostname}/invite/${token}`;
  useBackButton(() => setOpen(false));

  const session = useSession();

  return (
    <>
      <LoadingButton
        loading={loading}
        onClick={() => {
          setLoading(true);
          fetchRawApi("property/members/inviteLink/create", {
            inviterName: session.user.name,
            timestamp: new Date().toISOString(),
          }).then((res) => {
            setLoading(false);
            setToken(res.token);
            setOpen(true);
          });
        }}
        sx={{ m: 1 }}
        variant="contained"
        size="large"
      >
        Copy member invite link
      </LoadingButton>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Puller />
        <Box
          sx={{
            p: 3,
            pt: 0,
          }}
        >
          <Typography gutterBottom variant="h6">
            Member invite link
          </Typography>
          <Typography gutterBottom>
            This link is only valid once and will expire in 24 hours. Do not
            share this link with anyone you do not trust.
          </Typography>
          <TextField
            variant="filled"
            value={url}
            InputProps={{
              readOnly: true,
            }}
            label="Invite URL"
          />
          <Box sx={{ display: "flex", mt: 2, alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success("Copied to clipboard", toastStyles);
              }}
            >
              Copy
            </Button>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => {
                window.open(url, "_blank");
              }}
            >
              Open
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

/**
 * Description
 * @param {any} {color
 * @param {any} members}
 * @returns {any}
 */
export function AddPersonModal({
  color,
  disabled,
  members,
}: {
  disabled;
  color: string;
  members: string[];
}) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [permission, setPermission] = React.useState("member");

  /**
   * Add person modal
   * @param {SelectChangeEvent} event
   * @returns {any}
   */
  const handleChange = React.useCallback(
    (event: SelectChangeEvent) => setPermission(event.target.value as string),
    []
  );

  useBackButton(() => setOpen(false));

  const [email, setEmail] = useState("");
  const deferredEmail = useDeferredValue(email);

  const session = useSession();

  return (
    <>
      <Prompt callback={() => setOpen(true)}>
        <Button
          variant="contained"
          disabled={disabled || session.property.permission !== "owner"}
          sx={{
            px: 2,
            ml: "auto",
          }}
        >
          <Icon>add</Icon>
          Invite
        </Button>
      </Prompt>
      <SwipeableDrawer
        open={open}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: {
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            overflow: "scroll",
            maxHeight: "95vh",
          },
        }}
        onClose={() => setOpen(false)}
        anchor="bottom"
      >
        <Puller />
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography variant="h5">Invite a person</Typography>
          <Alert severity="warning" sx={{ my: 2 }}>
            Make sure you trust who you are inviting. Anyone you invite can
            access everything you see.
          </Alert>
          <TextField
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            variant="filled"
            label="Enter an email address"
            placeholder="elonmusk@gmail.com"
          />
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={permission}
              variant="filled"
              sx={{
                mt: 2,
                pt: 0,
                pb: 1,
                mb: 2,
                height: "90px",
                "& *, &": { whiteSpace: "unset!important" },
              }}
              label="Permissions"
              onChange={handleChange}
            >
              <MenuItem value={"read-only"}>
                <Box
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Read only</Typography>
                  <Typography variant="body2">
                    View access to your inventory, rooms, and lists
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value={"member"}>
                <Box
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Member</Typography>
                  <Typography variant="body2">
                    Can view and edit your inventory, rooms, lists, etc
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <LoadingButton
            loading={loading}
            disabled={deferredEmail.trim() == ""}
            onClick={() => {
              if (members.find((member) => member === deferredEmail)) {
                toast.error(
                  "This person is already a member of this house",
                  toastStyles
                );
                return;
              }
              if (isEmail(deferredEmail)) {
                fetchRawApi("property/members/add", {
                  inviterName: session.user.name,
                  name: session.property.profile.name,
                  timestamp: new Date().toISOString(),
                  permission: permission,
                  email: deferredEmail,
                }).then(() => toast.success("Invited!"));
                setLoading(true);
              } else {
                toast.error("Please enter a valid email address", toastStyles);
              }
            }}
            variant="contained"
            size="large"
            sx={{ m: 1 }}
          >
            Send invitation
          </LoadingButton>
          <LinkToken />
        </Box>
      </SwipeableDrawer>
    </>
  );
}
