"use client";

import { ProfilePicture } from "@/app/(app)/users/[id]/ProfilePicture";
import { OptionsGroup } from "@/components/OptionsGroup";
import { useSession } from "@/lib/client/session";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { SpacesLayout } from "../../SpacesLayout";

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
    alert(1);
  };

  return (
    <SpacesLayout title="Invite">
      <Alert severity="warning">
        <AlertTitle sx={{ p: 0 }}>Careful!</AlertTitle>
        Invited members can see all public tasks &amp; items.
      </Alert>
      <OptionsGroup
        currentOption={view}
        setOption={setView}
        options={["Send invite", "Shareable link"]}
        sx={{ my: 2 }}
      />
      {data ? (
        <>
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
      )}
    </SpacesLayout>
  );
}
