import { ProfilePicture } from "@/app/(app)/users/[id]/ProfilePicture";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useDeferredValue, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export function ShareBoard({ mutate, board }) {
  const { session } = useSession();

  const { data, error } = useSWR([
    "space/shareTokens",
    {
      board: board.id,
    },
  ]);

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [loadingGroupVisibility, setLoadingGroupVisibility] =
    useState<boolean>(false);

  const deferredEmail = useDeferredValue(email);
  const [expiration, setExpiration] = useState<string>("7");
  const [permissions, setPermissions] = useState<string>("true");

  const handleChange = (event: SelectChangeEvent) => {
    setExpiration(event.target.value as string);
  };

  const handlePermissionsChange = (event: SelectChangeEvent) => {
    setPermissions(event.target.value as string);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      if (
        data?.find((share) => share.user.email === deferredEmail) ||
        (board.public &&
          board.property.members.find(
            (member) => member.user.email === deferredEmail
          ))
      ) {
        toast.error("This person already has access to this board");
        setLoading(false);
        return;
      }
      try {
        const res = await fetchRawApi(session, "space/shareTokens", {
          method: "POST",
          params: {
            board: board.id,
            readOnly: permissions,
            email: deferredEmail,
            boardProperty: board.property.id,
            name: session.user.name,
            expiresAt: dayjs().add(parseInt(expiration), "day").toISOString(),
          },
        });
        if (res.error) {
          throw new Error(res.error);
        }
        toast.success("The share link has been generated successfully!");
        await mutate();
      } catch (e) {
        toast.error("Could not generate the share link! Is the email correct?");
        setLoading(false);
      }
      setEmail("");
      setLoading(false);
    } catch (e) {
      toast.error(
        "Yikes! Something happened while trying to generate the share link! Please try again later."
      );
      setLoading(false);
    }
  };

  const handleRevoke = async (token) => {
    await fetchRawApi(session, "space/shareTokens/revoke", {
      method: "DELETE",
      params: { token },
    });
    await mutate();
  };

  const boxStyles = {
    mt: 2,
    px: 3,
    py: 1,
    borderRadius: 5,
    background: palette[2],
  };

  const toggleGroupVisibility = async () => {
    try {
      setLoadingGroupVisibility(true);
      await fetchRawApi(session, "space/boards", {
        method: "PUT",
        params: { id: board.id, public: !board.public },
      });
      await mutate();
      setLoadingGroupVisibility(false);
    } catch (e) {
      toast.error(
        "Yikes! Something happened while trying to change the group visibility! Please try again later."
      );
      setLoadingGroupVisibility(false);
    }
  };

  const { data: friends } = useSWR([
    "user/profile/friends",
    {
      email: session.user.email,
      date: dayjs().startOf("day").toISOString(),
      timezone: session.user.timeZone,
    },
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Autocomplete
          value={email}
          onChange={(_, e: any) => {
            if (e && typeof e === "object") {
              const email = (e.following || e.follower).email;
              // alert(email);
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
              (option.follower || option.following)?.name
                ?.toLowerCase()
                ?.trim()
                ?.includes(state.inputValue.toLowerCase().trim())
            );

            return displayOptions;
          }}
          slotProps={{
            paper: {
              sx: {
                border: "2px solid",
                borderRadius: 5,
                mt: 2,
                p: 1,
                background: palette[2],
                borderColor: palette[3],
              },
            },
          }}
          blurOnSelect
          renderOption={(props, option, state, ownerState) => {
            const user =
              (ownerState.getOptionLabel(option) as any).follower ||
              (ownerState.getOptionLabel(option) as any).following;

            return (
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
                  <Typography sx={{ fontWeight: 900 }}>{user.name}</Typography>
                  <Typography>
                    Active {dayjs(user.lastActive).fromNow()}
                  </Typography>
                </Box>
              </Box>
            );
          }}
          sx={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Type an email" />
          )}
        />
        {/* <TextField
          label="Type an email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hello@dysperse.com"
          fullWidth
          size="small"
        /> */}
        <FormControl sx={{ width: 400 }}>
          <InputLabel id="demo-simple-select-label">Permission</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={permissions}
            MenuProps={{
              sx: { zIndex: 99999999 },
            }}
            label="Permission"
            onChange={handlePermissionsChange}
            size="small"
          >
            <MenuItem value={"true"}>Read-only</MenuItem>
            <MenuItem value={"false"}>Edit</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: 400 }}>
          <InputLabel id="demo-simple-select-label">
            Allow access for...
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={expiration}
            MenuProps={{
              sx: {
                zIndex: 99999999,
              },
            }}
            label="Allow access for..."
            onChange={handleChange}
            size="small"
          >
            <MenuItem value={1}>1 day</MenuItem>
            <MenuItem value={7}>1 week</MenuItem>
            <MenuItem value={30}>1 month</MenuItem>
            <MenuItem value={60}>2 months</MenuItem>
            <MenuItem value={90}>3 months</MenuItem>
            <MenuItem value={365}>1 year</MenuItem>
          </Select>
        </FormControl>
        <LoadingButton
          loading={loading}
          onClick={handleGenerate}
          variant="contained"
          sx={{ px: 2, flexShrink: 0 }}
        >
          Invite <Icon>send</Icon>
        </LoadingButton>
      </Box>

      <Box sx={boxStyles}>
        <ListItem
          sx={{
            px: 0,
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <Icon className="outlined">
                {board.property?.type === "dorm"
                  ? "cottage"
                  : board.property?.type === "apartment"
                  ? "location_city"
                  : board.property?.type === "study group"
                  ? "school"
                  : "home"}
              </Icon>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{
              "&, & *": {
                minWidth: 0,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              },
            }}
            primary={board.property?.name}
            secondary={
              board.public ? "Visible to members" : "Hidden from members"
            }
          />
          <IconButton
            sx={{ ml: "auto" }}
            disabled={loadingGroupVisibility}
            onClick={toggleGroupVisibility}
          >
            <Icon className="outlined">
              {board.public ? "visibility" : "visibility_off"}
            </Icon>
          </IconButton>
        </ListItem>
        {board.property.members
          .filter(
            (member, index, self) =>
              self.findIndex((m) => m.user.email === member.user.email) ===
              index
          )
          .filter((m) => board.public || m.user.email !== session.user.email)
          .map((member) => (
            <ListItem
              key={member.user.email}
              sx={{
                px: 0,
              }}
            >
              <Avatar sx={{ mr: 2 }} src={member.user?.Profile?.picture}>
                {member.user.name.substring(0, 2).toUpperCase()}
              </Avatar>
              <ListItemText
                primary={member.user.name}
                secondary="In group"
                sx={{
                  "&, & *": {
                    minWidth: 0,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  },
                }}
              />
              {board.user.email === member.user.email && <Chip label="Owner" />}
            </ListItem>
          ))}
        {data && data.length > 0 && <Divider />}
        {data ? (
          data.map((share) => (
            <ListItem
              key={share.id}
              sx={{
                ...(dayjs(share.expiresAt).isBefore(dayjs()) && {
                  opacity: 0.6,
                }),
                px: 0,
              }}
            >
              <Avatar sx={{ mr: 2 }} src={share.user?.Profile?.picture}>
                {share.user.name.substring(0, 2).toUpperCase()}
              </Avatar>
              <ListItemText
                sx={{
                  "&, & *": {
                    minWidth: 0,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  },
                }}
                primary={share.user.name}
                secondary={`${
                  (dayjs(share.expiresAt).isBefore(dayjs())
                    ? "Expired "
                    : "Expires ") + dayjs(share.expiresAt).fromNow()
                } ∙ 
                  ${share.readOnly ? "Read only" : "Edit access"}`}
              />
              <IconButton
                sx={{ ml: "auto" }}
                disabled={window.location.href.includes(share.token)}
                onClick={() => handleRevoke(share.token)}
              >
                <Icon className="outlined">
                  {share.user.email === session.user.email
                    ? "logout"
                    : "delete"}
                </Icon>
              </IconButton>
            </ListItem>
          ))
        ) : data?.error ? (
          <ErrorHandler
            error="Oh no! An error occured while trying to get your active share links!"
            callback={() => mutate()}
          />
        ) : error ? (
          <ErrorHandler
            callback={() => mutate()}
            error="Oh no! An error occured while trying to get your active share links!"
          />
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Box>
  );
}
