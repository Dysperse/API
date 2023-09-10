import { ErrorHandler } from "@/components/Error";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Masonry } from "@mui/lab";
import {
  AppBar,
  Box,
  Chip,
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
import { useRouter } from "next/router";
import { cloneElement, useState } from "react";
import useSWR from "swr";
import RoomLayout from ".";

function ItemDrawerContent({ item, mutate, setOpen }) {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));

  const handleEdit = async (key, value) => {
    const newData = {
      ...item,
      [key]: value,
      updatedAt: new Date().toISOString(),
    };

    mutate(newData, {
      populateCache: newData,
      revalidate: false,
    });

    return await fetchRawApi(session, "property/inventory/items/edit", {
      id: item.id,
      updatedAt: dayjs().toISOString(),
      [key]: String(value),
      createdBy: session.user.email,
    });
  };

  const styles = {
    section: {
      background: palette[2],
      borderRadius: 5,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      mb: 3,
      "& .item": {
        color: palette[12],
        borderRadius: 0,
        "&.MuiListItem-root, &.MuiListItemButton-root": {
          px: 3,
        },
      },
      "& .item:not(:last-child)": {
        borderBottom: "1px solid",
        borderColor: palette[3],
      },
    },
    button: {
      color: palette[11],
      background: palette[3],
    },
  };

  return (
    <>
      <AppBar position="sticky" sx={{ top: 0, border: 0 }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton onClick={() => setOpen(false)} sx={styles.button}>
            <Icon className="outlined">close</Icon>
          </IconButton>
          <IconButton
            onClick={() => handleEdit("starred", !item.starred)}
            sx={{
              ...styles.button,
              ml: "auto",
              ...(item.starred && {
                background: orangePalette[3] + "!important",
                "&:hover": {
                  background: orangePalette[4] + "!important",
                },
                "&:active": {
                  background: orangePalette[5] + "!important",
                },
              }),
            }}
          >
            <Icon className={item.starred ? "" : "outlined"}>favorite</Icon>
          </IconButton>
          <IconButton onClick={() => setOpen(false)} sx={styles.button}>
            <Icon className="outlined">add_task</Icon>
          </IconButton>
          <IconButton onClick={() => setOpen(false)} sx={styles.button}>
            <Icon className="outlined">move_down</Icon>
          </IconButton>
          <IconButton onClick={() => setOpen(false)} sx={styles.button}>
            <Icon className="outlined">delete</Icon>
          </IconButton>
        </Toolbar>
        <Box sx={{ px: 3 }}>
          <TextField
            fullWidth
            placeholder="Item name"
            defaultValue={item.name}
            onBlur={(e) => handleEdit("name", e.target.value)}
            onKeyDown={(e: any) => e.key === "Enter" && e.target.blur()}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              className: "font-heading",
              sx: {
                "&:focus-within": {
                  "&, & *": { textTransform: "none!important" },
                  background: palette[2],
                  px: 1,
                  borderRadius: 5,
                },
                fontSize: { xs: "50px", sm: "var(--bottom-nav-height)" },
                textDecoration: "underline",
              },
            }}
          />
          <Box sx={styles.section}>
            {[
              "note",
              "condition",
              "quantity",
              "estimatedValue",
              "serialNumber",
            ].map((field) => (
              <TextField
                onBlur={(e) => handleEdit(field, e.target.value)}
                onKeyDown={(e: any) =>
                  e.key === "Enter" && !e.shiftKey && e.target.blur()
                }
                className="item"
                key={field}
                multiline
                fullWidth
                defaultValue={item[field]}
                placeholder={`Add ${field}...`}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { py: 1.5, px: 3 },
                }}
              />
            ))}
          </Box>
          <Box sx={styles.section}>
            <ListItem
              onClick={() =>
                router.push(
                  `/users/${item.createdBy.username || item.createdBy.email}`
                )
              }
            >
              <ListItemText
                primary={`Edited ${dayjs(item.updatedAt).fromNow()}`}
                secondary={
                  item.updatedAt !== item.createdAt &&
                  `Created ${dayjs(item.createdAt).fromNow()}`
                }
              />
              <Box>
                {item.createdBy && (
                  <ProfilePicture
                    mutate={mutate}
                    data={item.createdBy}
                    size={30}
                  />
                )}
              </Box>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Found in "${item.room?.name}"`}
                secondary={
                  item.room.private
                    ? "Only visible to you"
                    : `Visible to others in "${item.property.name}"`
                }
              />
            </ListItem>
          </Box>
          {/* {JSON.stringify(item, null, 2)} */}
        </Box>
      </AppBar>
    </>
  );
}

function ItemPopup({
  children,
  item,
  mutateList,
}: {
  children: JSX.Element;
  item: any;
  mutateList: any;
}) {
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
        onClose={() => {
          setOpen(false);
          mutateList();
        }}
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

function Room({ room, mutateList }) {
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
      <Box sx={{ mr: -3, mt: 4 }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={3}>
          {room.items.map((item, index) => (
            <ItemPopup key={item.id} item={item} mutateList={mutateList}>
              <Box
                sx={{
                  p: 2,
                  background: palette[2],
                  borderRadius: 5,
                  transition: "transform .2s cubic-bezier(.17,.67,.1,1.49)",
                  "&:hover": {
                    background: { sm: addHslAlpha(palette[3], 0.7) },
                    transform: {
                      sm:
                        index % 2
                          ? "rotate(1deg) scale(1.08)"
                          : "rotate(-1deg) scale(1.08)",
                    },
                  },
                  "&:active": {
                    background: addHslAlpha(palette[3], 0.9),
                    transform:
                      index % 2
                        ? "rotate(-1deg) scale(.97)"
                        : "rotate(1deg) scale(.97)",
                  },
                }}
              >
                <Typography variant="h6">{item.name}</Typography>
                {item.note && (
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Icon className="outlined">sticky_note_2</Icon>
                    {item.note}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    "&:not(:empty)": { mt: 1 },
                  }}
                >
                  {item.quantity && (
                    <Chip
                      size="small"
                      label={item.quantity + " pcs."}
                      icon={<Icon>interests</Icon>}
                    />
                  )}
                  {item.condition && (
                    <Chip
                      size="small"
                      label={item.condition}
                      icon={<Icon>question_mark</Icon>}
                    />
                  )}
                  {item.estimatedValue && (
                    <Chip
                      size="small"
                      label={item.estimatedValue}
                      icon={<Icon>attach_money</Icon>}
                    />
                  )}
                </Box>
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
      {data && <Room room={data} mutateList={mutate} />}
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
