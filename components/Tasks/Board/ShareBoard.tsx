import { ErrorHandler } from "@/components/Error";
import { isEmail } from "@/components/Group/Members";
import { useSession } from "@/lib/client/session";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Box,
  CircularProgress,
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

export function ShareBoard({ isShared, board, children }) {
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const trigger = cloneElement(children, { onClick: handleOpen });

  const { data, url, error } = useApi("property/shareTokens", {
    board: board.id,
  });

  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
          {data ? (
            <>
              {data.map((share) => (
                <ListItem
                  key={share.id}
                  sx={{
                    px: 0,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <ListItemText
                    primary={dayjs(share.createdAt).fromNow()}
                    secondary={"Expires " + dayjs(share.expiresAt).fromNow()}
                  />
                  <IconButton
                    sx={{ ml: "auto" }}
                    disabled={window.location.href.includes(share.token)}
                    onClick={() => handleRevoke(share.token)}
                  >
                    <Icon>delete</Icon>
                  </IconButton>
                </ListItem>
              ))}
            </>
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
      </SwipeableDrawer>
    </>
  );
}
