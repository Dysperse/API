import { ErrorHandler } from "@/components/Error";
import { isEmail } from "@/components/Group/Members";
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
  Icon,
  IconButton,
  ListItem,
  ListItemText,
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

  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [loadingGroupVisibility, setLoadingGroupVisibility] =
    useState<boolean>(false);

  const deferredEmail = useDeferredValue(email);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await fetchRawApi(session, "property/shareTokens/create", {
        board: board.id,
        date: new Date().toISOString(),
        expires: 7,
        email,
      });

      setToken(data.token);
      setLoading(false);
    } catch (e) {
      toast.error(
        "Yikes! Something happened while trying to generate the share link! Please try again later.",
        toastStyles
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

  const link = isShared
    ? window.location.href
    : `${window.location.origin}/tasks/boards/${board.id}?share=${token}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(link);
    toast.success("Copied link to clipboard!", toastStyles);
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
        toastStyles
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
        sx={{ zIndex: 9999 }}
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
          <TextField
            label="Type an email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@dysperse.com"
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
          {token && (
            <TextField
              label="Board link"
              value={link}
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            />
          )}
          <LoadingButton
            disabled={!isEmail(deferredEmail)}
            loading={loading}
            onClick={copyUrl}
            sx={{ mt: 1, ...(!isShared && !token && { display: "none" }) }}
            variant="outlined"
            fullWidth
          >
            Copy
          </LoadingButton>
          {!isShared && (
            <LoadingButton
              loading={loading}
              onClick={handleGenerate}
              sx={{ mt: 1 }}
              variant="contained"
              fullWidth
            >
              Create link
            </LoadingButton>
          )}
          <Box sx={boxStyles}>
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
                disabled={loadingGroupVisibility}
                onClick={toggleGroupVisibility}
              >
                <Icon className="outlined">
                  visibility{!board.public && "_off"}
                </Icon>
              </IconButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            {data ? (
              data.map((share) => (
                <ListItem
                  key={share.id}
                  sx={{
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
                    secondary={"Expires " + dayjs(share.expiresAt).fromNow()}
                  />
                  <IconButton
                    sx={{ ml: "auto" }}
                    disabled={window.location.href.includes(share.token)}
                    onClick={() => handleRevoke(share.token)}
                  >
                    <Icon className="outlined">delete</Icon>
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
