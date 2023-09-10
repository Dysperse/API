import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Masonry } from "@mui/lab";
import {
  AppBar,
  Box,
  CircularProgress,
  Icon,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { cloneElement, useState } from "react";
import useSWR from "swr";
import RoomLayout from ".";

function ItemDrawerContent({ item, mutate, setOpen }) {
  const session = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const styles = {
    button: {
      color: palette[11],
      background: palette[3],
    },
  };
  return (
    <>
      <AppBar position="sticky" sx={{ top: 0, border: 0 }}>
        <Toolbar>
          <IconButton onClick={() => setOpen(false)} sx={styles.button}>
            <Icon className="outlined">close</Icon>
          </IconButton>
        </Toolbar>
        {JSON.stringify(item)}
      </AppBar>
    </>
  );
}

function ItemPopup({ children, item }: { children: JSX.Element; item: any }) {
  const session = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const trigger = cloneElement(children, { onClick: () => setOpen(true) });

  const { data, isLoading, mutate, error } = useSWR(
    open ? ["property/inventory/items", { id: item.id }] : null
  );

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "500px" },
            borderLeft: { sm: "2px solid " + palette[3] },
          },
        }}
      >
        {data && (
          <ItemDrawerContent item={data} mutate={mutate} setOpen={setOpen} />
        )}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {error && (
          <ErrorHandler
            error="Something went wrong. Please try again later"
            callback={mutate}
          />
        )}
      </SwipeableDrawer>
    </>
  );
}

function Room({ room }) {
  const session = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" },
          background: palette[2],
          p: 3,
          pt: { xs: 5, sm: 3 },
          gap: { xs: 0, sm: 3 },
          borderRadius: 5,
        }}
      >
        <img
          src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${room.emoji}.png`}
          alt="emoji"
        />
        <Box sx={{ mt: { xs: 1, sm: 0 } }}>
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
        <Box sx={{ ml: { sm: "auto" } }}>
          <IconButton>
            <Icon className="outlined" sx={{ fontSize: "30px!important" }}>
              add_circle
            </Icon>
          </IconButton>
          <IconButton>
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
      <Box sx={{ mr: -2, mt: 2 }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={2}>
          {room.items.map((item) => (
            <ItemPopup key={item.id} item={item}>
              <Box
                sx={{
                  p: 2,
                  background: palette[2],
                  borderRadius: 5,
                  "&:hover": {
                    background: { sm: palette[3] },
                  },
                  "&:active": {
                    background: palette[4],
                  },
                }}
              >
                {item.name}
              </Box>
            </ItemPopup>
          ))}
        </Masonry>
      </Box>
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
