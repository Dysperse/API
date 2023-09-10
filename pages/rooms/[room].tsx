import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import useSWR from "swr";
import RoomLayout from ".";

function Room({ room }) {
  const session = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: palette[2],
          p: 3,
          gap: 3,
          borderRadius: 5,
        }}
      >
        <img
          src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${room.emoji}.png`}
          alt="emoji"
        />
        <Box>
          <Typography variant="h2" className="font-heading">
            {room.name}
          </Typography>
          {room.note && (
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <Icon className="outlined">sticky_note_2</Icon>
              {room.note}
            </Typography>
          )}
        </Box>
        <Box sx={{ ml: "auto" }}>
          <IconButton sx={{ ml: "auto" }}>
            <Icon className="outlined" sx={{ fontSize: "30px!important" }}>
              add_circle
            </Icon>
          </IconButton>
          <IconButton sx={{ ml: "auto" }}>
            <Icon className="outlined" sx={{ fontSize: "30px!important" }}>
              pending
            </Icon>
          </IconButton>
        </Box>
      </Box>
      {room.items.length === 0 && (
        <Box sx={{ mt: 2, background: palette[2], borderRadius: 5, p: 3 }}>
          No items
        </Box>
      )}
    </Box>
  );
}

export default function Page() {
  const session = useSession();
  const router = useRouter();

  const { data, isLoading, mutate, error } = useSWR(
    router?.query?.room
      ? ["property/inventory/rooms/items", { id: router.query.room }]
      : null
  );

  return (
    <RoomLayout>
      {data && <Room room={data} />}
      {isLoading && <CircularProgress />}
      {error && (
        <ErrorHandler
          error={"Something went wrong. Please try again later"}
          callback={mutate}
        />
      )}
    </RoomLayout>
  );
}
