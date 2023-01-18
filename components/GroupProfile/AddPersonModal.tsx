import emailjs from "@emailjs/browser";
import LoadingButton from "@mui/lab/LoadingButton";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";
import { Prompt } from "../TwoStepVerificationPrompt";
import { isEmail } from "./MemberList";

import {
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

function LinkToken({ color }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState("");
  const url = `https://${window.location.hostname}/invite/${token}`;
  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <LoadingButton
        loading={loading}
        onClick={() => {
          setLoading(true);
          fetchApiWithoutHook("property/members/createLink", {
            inviterName: global.user.name,
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
          sx: {
            maxWidth: "400px",

            background: colors[color][100],
          },
        }}
      >
        <Puller />
        <Box
          sx={{
            p: 5,
          }}
        >
          <Typography gutterBottom variant="h6" sx={{ fontWeight: 600 }}>
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
              toast.success("Copied to clipboard");
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
              background: `${colors[themeColor][900]}!important`,
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
  members,
}: {
  color: string;
  members: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [permission, setpermission] = React.useState("member");

  const [twoFactorPrompt, setTwoFactorPrompt] = React.useState(false);
  /**
   * Add person modal
   * @param {SelectChangeEvent} event
   * @returns {any}
   */
  const handleChange = (event: SelectChangeEvent) => {
    setpermission(event.target.value as string);
  };

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <Button
        onClick={() => setTwoFactorPrompt(true)}
        variant="contained"
        disabled={global.property.permission !== "owner"}
        sx={{
          mb: 2,
          borderRadius: 4,
          ml: "auto",
          boxShadow: 0,
          ...(global.property.permission === "owner" && {
            backgroundColor: `${
              colors[color][global.user.darkMode ? 800 : 900]
            }!important`,
            color: `${colors[color][50]}!important`,
          }),
        }}
      >
        <Icon>add</Icon>
        Invite
      </Button>
      <Prompt
        open={twoFactorPrompt}
        setOpen={setTwoFactorPrompt}
        callback={() => {
          setOpen(true);
        }}
      />
      <SwipeableDrawer
        open={open}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: {
            background: colors[color][50],
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
          <Box
            sx={{
              fontSize: "15px",
              my: 4,
              background: global.user.darkMode
                ? "hsl(240, 11%, 30%)"
                : colors[color][100],
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
            Make sure you trust who you are inviting. Anyone with access can
            view your lists, rooms, and inventory
          </Box>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
              if (members.find((member) => member === value)) {
                toast.error("This person is already a member of this house");
                return;
              }
              if (isEmail(value)) {
                fetchApiWithoutHook("property/members/add", {
                  inviterName: global.user.name,
                  name: global.property.profile.name,
                  timestamp: new Date().toISOString(),
                  permission: permission,
                  email: value,
                })
                  .then((res) => {
                    emailjs
                      .send(
                        "service_bhq01y6",
                        "template_nbjdq1i",
                        {
                          to_email: value,
                          house_name: res.profile.name,
                        },
                        "6Q4BZ_DN9bCSJFZYM"
                      )
                      .then(() => {
                        toast.success("Invitation sent!");
                        setLoading(false);
                      })
                      .catch(() => {
                        toast(
                          "An invitation was sent, but something went wrong while trying to send an email notification",
                          { duration: 10000 }
                        );
                        setLoading(false);
                      });
                  })
                  .catch(() => {
                    setLoading(false);
                    toast.error(
                      "An error occured while trying to send an invite"
                    );
                  });
                setLoading(true);
              } else {
                toast.error("Please enter a valid email address");
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
