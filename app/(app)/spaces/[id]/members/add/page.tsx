"use client";

import { ProfilePicture } from "@/app/(app)/users/[id]/ProfilePicture";
import { OptionsGroup } from "@/components/OptionsGroup";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { isEmail } from "../../../../../../utils/isEmail";
import { SpacesLayout } from "../../SpacesLayout";

function LinkToken() {
  const { session } = useSession();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState("");
  const url = `https://${window.location.hostname}/invite/${token}`;

  const copyText = () => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  const createLink = () => {
    setLoading(true);
    fetchRawApi(session, "space/members/inviteLink", {
      method: "POST",
      params: {
        inviterName: session.user.name,
        timestamp: new Date().toISOString(),
      },
    }).then((res) => {
      setLoading(false);
      setToken(res.token);
      setOpen(true);
    });
  };

  return (
    <>
      <Alert severity="info">
        <AlertTitle>Heads up!</AlertTitle>
        <Typography>
          We&apos;re about to create a special link for you. <i>Anyone</i> who
          has access can join your space. For your safety, links expire after 24
          hours and can only be used once.
        </Typography>
        <LoadingButton
          loading={loading}
          onClick={createLink}
          sx={{ m: 1, float: "right" }}
          variant="outlined"
        >
          Continue
        </LoadingButton>
      </Alert>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
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
              onClick={copyText}
            >
              Copy
            </Button>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => window.open(url, "_blank")}
            >
              Open
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default function Page() {
  const { session } = useSession();
  const params = useParams();
  const { id } = params as any;
  const [view, setView] = useState<"Send invite" | "Shareable link">(
    "Send invite"
  );

  const [email, setEmail] = useState<string>("");
  const [permission, setPermission] = useState("member");

  const [loading, setLoading] = useState(false);

  const { error, mutate, data } = useSWR(["space/members", { propertyId: id }]);
  const { data: friends } = useSWR([
    "user/friends",
    { email: session.user.email },
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPermission((event.target as HTMLInputElement).value);

  const handleSubmit = async () => {
    try {
      if (data.find((member) => member.user.email === email)) {
        setEmail("");
        throw new Error("This person already has access");
      }
      if (isEmail(email)) {
        setLoading(true);
        await fetchRawApi(session, "space/members", {
          method: "POST",
          params: {
            inviterName: session.user.name,
            name: session.space.info.name,
            timestamp: new Date().toISOString(),
            permission: permission,
            email,
          },
        });
        await mutate();
        setEmail("");
        toast.success("Invited!");
        setLoading(false);
        mutate();
      } else {
        throw new Error("Please enter a valid email address");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <SpacesLayout title="Invite">
      <OptionsGroup
        currentOption={view}
        setOption={setView}
        options={["Send invite", "Shareable link"]}
        sx={{ mb: 2 }}
      />
      {view === "Send invite" ? (
        data ? (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Careful!</AlertTitle>
              Invited members can see all public tasks &amp; items.
            </Alert>
            <Autocomplete
              value={email}
              onChange={(_, e: any) => {
                if (e && typeof e === "object" && e.inputValue) {
                  setEmail(e.inputValue);
                } else if (e && typeof e === "object") {
                  const email = (e.following || e.follower).email;
                  setEmail(email);
                } else {
                  setEmail(e);
                }
              }}
              disablePortal
              options={friends?.friends || []}
              freeSolo
              filterOptions={(options, state) => {
                const displayOptions = options.filter((option) =>
                  ["name", "email", "username"].some((prop) =>
                    (option.follower || option.following)?.[prop]
                      ?.toLowerCase()
                      ?.trim()
                      ?.includes(state.inputValue.toLowerCase().trim())
                  )
                );

                const { inputValue } = state;
                const isExisting = options.some(
                  (option) =>
                    inputValue === (option.following || option.follower).email
                );
                if (inputValue !== "" && !isExisting) {
                  displayOptions.push({
                    inputValue,
                    text: `Add "${inputValue}"`,
                  });
                }

                return displayOptions;
              }}
              blurOnSelect
              renderOption={(props, option, state, ownerState) => {
                const user =
                  (ownerState.getOptionLabel(option) as any).follower ||
                  (ownerState.getOptionLabel(option) as any).following;

                return user ? (
                  <Box
                    sx={{
                      gap: 2,
                      borderRadius: 5,
                      [`&.MuiAutocomplete-option`]: {
                        padding: "8px",
                      },
                    }}
                    component="li"
                    {...props}
                  >
                    <ProfilePicture size={40} data={user} />
                    <Box>
                      <Typography sx={{ fontWeight: 900 }}>
                        {user.name}
                      </Typography>
                      <Typography>
                        Active {dayjs(user.lastActive).fromNow()}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box {...props} component="li">
                    {(ownerState.getOptionLabel(option) as any).text}
                  </Box>
                );
              }}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Type an email" />
              )}
            />

            <Typography
              variant="body2"
              sx={{ fontWeight: 900, opacity: 0.6, px: 1, mt: 3 }}
            >
              Permission
            </Typography>
            <FormControl>
              <RadioGroup
                value={permission}
                onChange={handleChange}
                sx={{
                  "& .MuiFormControlLabel-root": { pt: 2, px: 1 },
                  "& .about": {
                    pl: 2,
                    "& .MuiTypography-root:not(.MuiTypography-body2)": {
                      fontWeight: 600,
                    },
                  },
                  mb: 2,
                }}
              >
                <FormControlLabel
                  value="member"
                  control={<Radio />}
                  label={
                    <Box className="about">
                      <Typography>Member</Typography>
                      <Typography variant="body2">
                        Read/edit tasks and items. Cannot invite new members.
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="read-only"
                  control={<Radio />}
                  label={
                    <Box className="about">
                      <Typography>Read only</Typography>
                      <Typography variant="body2">
                        See tasks &amp; items
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
            <LoadingButton
              loading={loading}
              disabled={!email?.trim()}
              onClick={handleSubmit}
              variant="contained"
              size="large"
              fullWidth
            >
              Send invitation
            </LoadingButton>
          </>
        ) : (
          <CircularProgress />
        )
      ) : (
        <>
          <LinkToken />
        </>
      )}
    </SpacesLayout>
  );
}
