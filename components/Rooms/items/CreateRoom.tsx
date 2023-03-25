import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormLabel,
  SwipeableDrawer,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchRawApi } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";
import { colors } from "../../../lib/colors";
import { useAccountStorage, useSession } from "../../../pages/_app";
import { Puller } from "../../Puller";
import Action from "../../Rooms/Action";

export function CreateRoom({ mutationUrl }): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState("");
  const [isPrivate, setIsPrivate] = React.useState<boolean>(false);
  const storage = useAccountStorage();
  const session = useSession();

  const handleSubmit = () => {
    setLoading(true);
    fetchRawApi("property/inventory/room/create", {
      name: name,
      private: isPrivate ? "true" : "false",
    })
      .then(() => {
        setOpen(false);
        setLoading(false);
        setName("");
        toast.success("Room created", toastStyles);
        mutate(mutationUrl);
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
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
      >
        <Puller />
        <Box
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Typography variant="h6" className="font-bold">
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
            sx={{
              background:
                colors[session?.themeColor || "grey"][900] + "!important",
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
      <Action
        mutationUrl={mutationUrl}
        disableLoading
        icon="add_circle"
        disabled={storage?.isReached === true}
        primary={
          session.property.profile.type === "study group"
            ? "New container"
            : "New room"
        }
        count={{
          byRoom: {
            "new container": -3,
            "new room": -3,
          },
        }}
        onClick={() => setOpen(true)}
      />
    </>
  );
}
