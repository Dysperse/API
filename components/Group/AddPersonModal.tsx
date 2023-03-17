import LoadingButton from "@mui/lab/LoadingButton";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../lib/client/useApi";
import { useBackButton } from "../../lib/client/useBackButton";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";
import { Prompt } from "../TwoStepVerificationPrompt";
import { isEmail } from "./MemberList";

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
import { toastStyles } from "../../lib/client/useTheme";
import { useSession } from "../../pages/_app";

function LinkToken({ color }) {
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
          fetchApiWithoutHook("property/members/inviteLink/create", {
            inviterName: session?.user?.name,
            timestamp: new Date().toISOString(),
          }).then((res) => {
            setLoading(false);
            setToken(res.token);
            setOpen(true);
          });
        }}
        variant="outlined"
        size="large"
        sx={{
          borderRadius: 4,
          transition: "none!important",
          mt: 1,
          float: "right",
        }}
      >
        Copy member invite link
      </LoadingButton>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: { maxWidth: "400px" },
        }}
      >
        <Puller />
        <Box
          sx={{
            p: 5,
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
          <Button
            variant="outlined"
            size="large"
            sx={{ mt: 2, borderRadius: 999 }}
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success("Copied to clipboard", toastStyles);
            }}
          >
            Copy
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              borderRadius: 999,
              background: `${
                colors[session?.themeColor || "grey"][900]
              }!important`,
            }}
            onClick={() => {
              window.open(url, "_blank");
            }}
          >
            Open
          </Button>
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

  const ref: any = useRef();
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
            boxShadow: 0,
            ...(session.property.permission === "owner" && {
              backgroundColor: `${
                colors[color][session?.user?.darkMode ? 800 : 900]
              }!important`,
              color: `${colors[color][50]}!important`,
            }),
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
        swipeAreaWidth={0}
      >
        <Puller />
        <Box sx={{ p: 4 }}>
          <Typography variant="h5">Invite a person</Typography>
          <Alert severity="warning" sx={{ my: 2 }}>
            Make sure you trust who you are inviting. Anyone with access can
            view your lists, rooms, and inventory
          </Alert>
          <TextField
            inputRef={ref}
            variant="filled"
            label="Enter an email address"
          />
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={permission}
              variant="filled"
              sx={{ mt: 2, pt: 0, pb: 1, mb: 2, height: "90px" }}
              label="Permissions"
              onChange={handleChange}
            >
              <MenuItem value={"read-only"}>
                <Box sx={{ my: 1 }}>
                  <Typography variant="h6">Read only</Typography>
                  <Typography variant="body2">
                    View access to your inventory, rooms, and lists
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value={"member"}>
                <Box sx={{ my: 1 }}>
                  <Typography variant="h6">Member</Typography>
                  <Typography variant="body2">
                    Can view and edit your inventory, rooms, lists, etc
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <LoadingButton
            loading={loading}
            onClick={() => {
              const value = ref.current.value;
              if (members.find((member) => member === value)) {
                toast.error(
                  "This person is already a member of this house",
                  toastStyles
                );
                return;
              }
              if (isEmail(value)) {
                fetchApiWithoutHook("property/members/add", {
                  inviterName: session?.user?.name,
                  name: session.property.profile.name,
                  timestamp: new Date().toISOString(),
                  permission: permission,
                  email: value,
                }).then((res) => {
                  toast.success("Invited!");
                });
                setLoading(true);
              } else {
                toast.error("Please enter a valid email address", toastStyles);
              }
            }}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 4,
              transition: "none!important",
              mt: 1,
              ml: 1,
              float: "right",
            }}
          >
            Send invitation
          </LoadingButton>
          <LinkToken color={color} />
        </Box>
      </SwipeableDrawer>
    </>
  );
}
