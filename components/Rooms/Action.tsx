import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { SidebarContext } from "@/pages/items";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Icon,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../ConfirmationModal";
import { Puller } from "../Puller";

interface RoomActionProps {
  icon: string;
  room: any;
  count?: any;
}

function Rename({ mutationUrl, handleClose, room }) {
  const storage = useAccountStorage();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(room?.name);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await fetchRawApi("property/inventory/room/edit", {
      name: value,
      id: room?.id,
    });
    await mutate(mutationUrl);
    handleClose();
    setLoading(false);
  };

  return (
    <>
      <MenuItem
        onClick={() => setOpen(true)}
        disabled={storage?.isReached === true}
      >
        <Icon className="outlined">edit</Icon>Rename
      </MenuItem>
      <SwipeableDrawer
        open={open}
        sx={{ zIndex: 9999 }}
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 3, pt: 0 }}>
          <TextField
            variant="filled"
            label="Room name..."
            placeholder="Backpack"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            margin="dense"
          />
          <LoadingButton
            loading={loading}
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
          >
            Done
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

const Action = ({ icon, room, count = null }: RoomActionProps) => {
  const router = useRouter();
  const storage = useAccountStorage();
  const mutationUrl = useContext(SidebarContext);
  const session = useSession();
  const isCustom = Boolean(room?.id);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: any) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const href =
    room == "Starred" || room === "Trash"
      ? `/${room.toLowerCase()}`
      : isCustom
      ? `/rooms/${room.id}/${room.name}`
      : `/rooms/${room?.toLowerCase()}`;

  const itemCount = count && count[isCustom ? room.id : room.toLowerCase()];
  return (
    <>
      <ListItemButton
        onContextMenu={handleClick}
        onClick={() => router.push(href)}
        sx={{
          ...(decodeURIComponent(router.asPath) == href && {
            background: `hsl(240,11%,${
              session.user.darkMode ? 15 : 95
            }%)!important`,
          }),
          transition: "none",
          mb: 0.2,
        }}
      >
        <ListItemIcon sx={{ minWidth: "40px" }}>
          <Icon>{isCustom && room.private ? "lock" : icon}</Icon>
        </ListItemIcon>
        <ListItemText
          primary={capitalizeFirstLetter((isCustom ? room?.name : room) || "")}
          {...(itemCount && {
            secondary: `${itemCount} item${itemCount !== 1 ? "s" : ""}`,
          })}
        />
        {isCustom && (
          <ListItemSecondaryAction>
            <IconButton
              onClick={(e: any) => {
                e.stopPropagation();
                handleClick(e);
              }}
            >
              <Icon>more_vert</Icon>
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItemButton>
      {isCustom && (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Rename
            handleClose={handleClose}
            room={room}
            mutationUrl={mutationUrl}
          />
          <ConfirmationModal
            title={`Make room ${room.private ? "public" : "private"}?`}
            question={`Are you sure you want to make this room ${
              room.private ? "public" : "private"
            }? Other members ${
              room.private ? "will" : "will not"
            } be able to view this room's contents`}
            callback={async () => {
              await fetchRawApi("property/inventory/room/edit", {
                private: room.private ? "false" : "true",
                id: room?.id,
              });
              await mutate(mutationUrl);
              toast.success("Updated room!", toastStyles);
              handleClose();
            }}
          >
            <MenuItem
              onClick={handleClose}
              disabled={
                storage?.isReached === true ||
                room.userIdentifier !== session.user.identifier
              }
            >
              <Icon className="outlined">
                {room.private ? "visibility" : "visibility_off"}
              </Icon>
              Make {room.private ? "public" : "private"}
            </MenuItem>
          </ConfirmationModal>
          <ConfirmationModal
            title="Delete room?"
            question="Are you sure you want to delete this room? This will delete all items in it, and CANNOT be undone!"
            callback={async () => {
              await fetchRawApi("property/inventory/room/delete", {
                id: room.id,
              });
              await mutate(mutationUrl);
              toast.success("Deleted room!", toastStyles);
              handleClose();
            }}
          >
            <MenuItem>
              <Icon className="outlined">delete</Icon>Delete
            </MenuItem>
          </ConfirmationModal>
        </Menu>
      )}
    </>
  );
};

export default Action;
