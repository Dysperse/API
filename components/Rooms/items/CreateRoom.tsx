import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import { SidebarContext } from "@/pages/items";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormLabel,
  Icon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { Puller } from "../../Puller";

export function CreateRoom(): JSX.Element {
  const mutate = useContext(SidebarContext);

  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState("");
  const [isPrivate, setIsPrivate] = React.useState<boolean>(false);
  const storage = useAccountStorage();
  const session = useSession();

  const handleSubmit = () => {
    setLoading(true);
    fetchRawApi(session, "property/inventory/room/create", {
      name: name,
      private: isPrivate ? "true" : "false",
    })
      .then(() => {
        setOpen(false);
        setLoading(false);
        setName("");
        toast.success("Room created", toastStyles);
        mutate();
      })
      .catch(() => {
        toast.error(
          "An error occurred while trying to create your room. Please try again later.",
          toastStyles
        );
        setLoading(false);
      });
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Puller />
        <Box
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Typography variant="h6">
            Create{" "}
            {session.property.profile.type === "study group"
              ? "container"
              : "room"}
          </Typography>
          <TextField
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            label={
              session.property.profile.type === "study group"
                ? "Container name (Example: backpack, drawer, etc.)"
                : "Room name"
            }
            variant="filled"
            margin="dense"
            autoFocus
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
            <Switch
              checked={isPrivate}
              onChange={(e: any) => setIsPrivate(e.target.checked)}
            />
            <FormLabel>
              <b>{isPrivate ? "Private" : "Public"}</b>
              <br />
              {isPrivate
                ? "Only you can see this " +
                  (session.property.profile.type === "study group"
                    ? "container"
                    : "room") +
                  " and its contents"
                : (session.property.profile.type === "study group"
                    ? "Container"
                    : "Room") + " will be visible to other group members"}
            </FormLabel>
          </Box>
          <LoadingButton
            variant="contained"
            fullWidth
            loading={loading}
            disabled={session.permission === "read-only"}
            sx={{
              mt: 2,
              borderRadius: 999,
            }}
            size="large"
            onClick={handleSubmit}
          >
            Create
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
      <ListItemButton
        onClick={() => setOpen(true)}
        sx={{
          cursor: { sm: "default" },
        }}
        disabled={storage?.isReached === true}
      >
        <ListItemIcon sx={{ minWidth: "40px" }}>
          <Icon className="outlined">add_circle</Icon>
        </ListItemIcon>
        <ListItemText primary="Create room" />
      </ListItemButton>
    </>
  );
}
