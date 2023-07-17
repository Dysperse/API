import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { cloneElement, useDeferredValue, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

export function ShareBoard({ isShared, board, children, mutationUrls }) {
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const trigger = cloneElement(children, { onClick: handleOpen });

  const { data, url, error } = useApi("property/shareTokens", {
    board: board.id,
  });

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [loadingGroupVisibility, setLoadingGroupVisibility] =
    useState<boolean>(false);

  const deferredEmail = useDeferredValue(email);
  const [expiration, setExpiration] = useState<string>("7");

  const handleChange = (event: SelectChangeEvent) => {
    setExpiration(event.target.value as string);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      if (
        data?.find((share) => share.user.email === deferredEmail) ||
        (board.public &&
          board.property.members.find(
            (member) => member.user.email === deferredEmail,
          ))
      ) {
        toast.error(
          "This person already has access to this board",
          toastStyles,
        );
        setLoading(false);
        return;
      }
      try {
        const res = await fetchRawApi(session, "property/shareTokens/create", {
          board: board.id,
          email: deferredEmail,
          boardProperty: board.property.id,
          expiresAt: dayjs().add(parseInt(expiration), "day").toISOString(),
        });
        if (res.error) {
          throw new Error(res.error);
        }
        toast.success(
          "The share link has been generated successfully!",
          toastStyles,
        );
        await mutate(url);
      } catch (e) {
        toast.error(
          "Could not generate the share link! Is the email correct?",
          toastStyles,
        );
        setLoading(false);
      }
      setEmail("");
      setLoading(false);
    } catch (e) {
      toast.error(
        "Yikes! Something happened while trying to generate the share link! Please try again later.",
        toastStyles,
      );
      setLoading(false);
    }
  };

  const handleRevoke = async (token) => {
    await fetchRawApi(session, "property/shareTokens/revoke", {
      token,
    });
    await mutate(url);
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
      await fetchRawApi(session, "property/boards/edit", {
        id: board.id,
        public: !board.public,
      });
      await mutate(mutationUrls.boardData);
      setLoadingGroupVisibility(false);
    } catch (e) {
      toast.error(
        "Yikes! Something happened while trying to change the group visibility! Please try again later.",
        toastStyles,
      );
      setLoadingGroupVisibility(false);
    }
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        anchor="bottom"
        sx={{ zIndex: 999 }}
        onKeyDown={(e) => e.stopPropagation()}
        PaperProps={{
          sx: { height: "100vh" },
        }}
      >
        <AppBar sx={{ border: 0 }}>
          <Toolbar>
            <IconButton onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ px: 5, pt: 4 }}>
          <Typography variant="h2" className="font-heading">
            Share
          </Typography>
          {!isShared && (
            <TextField
              label="Type an email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@dysperse.com"
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            />
          )}
          <FormControl fullWidth sx={{ mt: 2 }}>
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
          {!isShared && (
            <LoadingButton
              loading={loading}
              onClick={handleGenerate}
              sx={{ mt: 1 }}
              variant="contained"
              fullWidth
            >
              Invite
            </LoadingButton>
          )}
          <Box sx={boxStyles}>
            {session.property.propertyId === board.property.id && (
              <ListItem
                sx={{
                  px: 0,
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <ListItemText
                  primary={session.property?.profile?.name}
                  secondary="Your group"
                />
                <IconButton
                  sx={{ ml: "auto" }}
                  disabled={loadingGroupVisibility || isShared}
                  onClick={toggleGroupVisibility}
                >
                  <Icon className="outlined">
                    visibility{!board.public && "_off"}
                  </Icon>
                </IconButton>
              </ListItem>
            )}
            {session.property.propertyId === board.property.id && (
              <Divider sx={{ my: 1 }} />
            )}
            {board.property.members
              .filter(
                (member, index, self) =>
                  self.findIndex((m) => m.user.email === member.user.email) ===
                  index,
              )
              .filter(
                (m) => board.public || m.user.email === session.user.email,
              )
              .map((member) => (
                <ListItem
                  key={member.user.email}
                  sx={{
                    px: 0,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <Avatar sx={{ mr: 2 }} src={member.user?.Profile?.picture}>
                    {member.user.name.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={member.user.name}
                    secondary="In group"
                  />
                </ListItem>
              ))}
            {data ? (
              data.map((share) => (
                <ListItem
                  key={share.id}
                  sx={{
                    ...(dayjs(share.expiresAt).isBefore(dayjs()) && {
                      opacity: 0.6,
                    }),
                    px: 0,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <Avatar sx={{ mr: 2 }} src={share.user?.Profile?.picture}>
                    {share.user.name.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={share.user.name}
                    secondary={
                      (dayjs(share.expiresAt).isBefore(dayjs())
                        ? "Expired "
                        : "Expires ") + dayjs(share.expiresAt).fromNow()
                    }
                  />
                  <IconButton
                    sx={{ ml: "auto" }}
                    disabled={
                      window.location.href.includes(share.token) || isShared
                    }
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
                callback={() => mutate(url)}
              />
            ) : error ? (
              <ErrorHandler
                callback={() => mutate(url)}
                error="Oh no! An error occured while trying to get your active share links!"
              />
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
