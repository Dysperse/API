import { ErrorHandler } from "@/components/Error";
import { GroupSelector } from "@/components/Tasks/Layout";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  ListItemButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

function Panel() {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [view, setView] = useState("room");

  const open = Boolean(anchorEl);

  const handleClick = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (option: string) => {
    setView(option);
    setAnchorEl(null);
  };

  const buttonText = view === "room" ? "Rooms" : "Categories";

  const { data, mutate, error } = useSWR(["property/inventory/rooms"]);

  return (
    <Box
      sx={{
        width: "250px",
        flex: "0 0 250px",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* View menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleSelect("room")}>Rooms</MenuItem>
        <MenuItem onClick={() => handleSelect("category")} disabled>
          Category
        </MenuItem>
        <MenuItem onClick={() => handleSelect("estimatedValue")} disabled>
          Estimated value
        </MenuItem>
        <MenuItem onClick={() => handleSelect("condition")} disabled>
          Condition
        </MenuItem>
      </Menu>
      {/* Rest of the content */}
      <Box sx={{ height: "100%", p: 2, pb: 0 }}>
        <GroupSelector />
        <Box>
          <Button
            onClick={handleClick}
            variant="outlined"
            sx={{
              color: palette[11] + "!important",
              borderWidth: "2px !important",
              mt: 2,
              px: 1,
              borderRadius: 3,
              fontWeight: 800,
              gap: 0.5,
              opacity: 0.7,
            }}
          >
            {buttonText.toUpperCase()}
            <Icon>{!open ? "expand_more" : "expand_less"}</Icon>
          </Button>
        </Box>

        {/* Data */}
        {error && (
          <ErrorHandler
            callback={mutate}
            error="Something went wrong. Please try again later"
          />
        )}
        {!data && <CircularProgress />}
        {data &&
          data.map((room) => (
            <ListItemButton key={room.id}>
              {JSON.stringify(room)}
            </ListItemButton>
          ))}
        {view === "room" && (
          <ListItemButton
            onClick={() => router.push(`/rooms/create`)}
            sx={{ mt: 2 }}
          >
            <Icon>add_circle</Icon>New room
          </ListItemButton>
        )}
      </Box>
      {/* Scan */}
      <Box sx={{ width: "100%", p: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" fullWidth>
          <Icon>add</Icon>New
        </Button>
        <Button variant="contained">
          <Icon>process_chart</Icon>
        </Button>
      </Box>
    </Box>
  );
}

export default function RoomLayout({ children }) {
  const session = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  return (
    <Box
      sx={{
        display: "flex",
        height: { sm: "100dvh" },
        background: { sm: palette[2] },
      }}
    >
      {/* Sidebar */}
      <Panel />

      {/* Content */}
      <Box
        sx={{
          width: "100%",
          background: palette[1],
          borderRadius: { sm: "20px 0 0 20px" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
