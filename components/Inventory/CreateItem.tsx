import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  ListItem,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { cloneElement, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { RoomPicker } from "../../pages/rooms/audit";

export function CreateItem({
  defaultRoom,
  mutate,
  children,
}: {
  defaultRoom?: any;
  mutate: any;
  children: JSX.Element;
}) {
  const { session } = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const titleRef: any = useRef();

  const [open, setOpen] = useState(false);
  const trigger = cloneElement(children, { onClick: () => setOpen(true) });

  const [room, setRoom] = useState(defaultRoom);

  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef?.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (room) {
      setTimeout(() => titleRef?.current?.focus(), 100);
    }
  }, [room]);

  const styles = {
    icon: (active = false) => ({
      color: palette[11],
      p: 0.7,
      borderRadius: 3,
      ...(active && {
        background: palette[4] + "!important",
        "& .MuiIcon-root": {
          fontVariationSettings:
            '"FILL" 1, "wght" 200, "GRAD" 0, "opsz" 40!important',
        },
      }),
    }),
  };

  const [fields, setFields] = useState({
    name: "",
    quantity: null,
    note: null,
    categories: [],
    estimatedValue: null,
    serialNumber: null,
    condition: null,
    starred: false,
  });

  const [showedFields, setShowedFields] = useState({
    note: false,
    categories: false,
    estimatedValue: false,
    serialNumber: false,
    condition: false,
    starred: false,
  });

  const fieldOptions = [
    {
      name: "Estimated value",
      key: "estimatedValue",
      icon: "attach_money",
    },
    { name: "Serial number", key: "serialNumber", icon: "tag" },
    { name: "Condition", key: "condition", icon: "question_mark" },
    { name: "Note", key: "note", icon: "sticky_note_2" },
  ];

  const handleChange = (key, value) => {
    setFields({ ...fields, [key]: value });
  };

  const handleSubmit = () => {
    fetchRawApi(session, "property/inventory/items/create", {
      room: defaultRoom?.id,
      ...Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [key, String(value)])
      ),
    });
    toast.success("Created item!");
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        anchor="bottom"
        onClick={() => titleRef?.current?.focus()}
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            background: "transparent",
            borderRadius: 0,
          },
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 0 } }}>
          <RoomPicker room={room} setRoom={setRoom}>
            <Chip
              variant="outlined"
              label={room?.name || "Select a room"}
              icon={
                room && (
                  <Avatar
                    src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${room.emoji}.png`}
                    sx={{ width: 20, height: 20, borderRadius: 0 }}
                  />
                )
              }
            />
          </RoomPicker>
        </Box>
        <Box
          sx={{
            background: palette[2],
            width: { xs: "auto", sm: "500px" },
            border: { xs: "2px solid " + palette[3] },
            m: 2,
            borderRadius: 5,
            mx: { xs: 2, sm: "auto" },
          }}
        >
          <Box sx={{ p: 2, pb: 0 }}>
            <TextField
              value={fields.name}
              onChange={(e) =>
                handleChange("name", e.target.value.replaceAll("\n", ""))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              inputRef={titleRef}
              fullWidth
              placeholder="Item name"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 20 },
              }}
              multiline
            />
            <TextField
              value={fields.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              fullWidth
              onClick={(e) => e.stopPropagation()}
              placeholder="Add quantity"
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
            />
            {fieldOptions.map(
              (field) =>
                showedFields[field.key] && (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <Avatar
                        sx={{ background: palette[3], color: palette[11] }}
                      >
                        <Icon className="outlined">{field.icon}</Icon>
                      </Avatar>
                      <TextField
                        inputProps={{
                          id: field.key,
                        }}
                        value={fields[field.key]}
                        onChange={(e) =>
                          handleChange(field.key, e.target.value)
                        }
                        fullWidth
                        onClick={(e) => e.stopPropagation()}
                        placeholder={field.name}
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                        }}
                      />
                    </ListItem>
                  </motion.div>
                )
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 0.1,
              p: 2,
              pt: 1,
              alignItems: "center",
            }}
          >
            <IconButton
              sx={styles.icon(fields.starred)}
              onClick={() => setFields({ ...fields, starred: !fields.starred })}
            >
              <Icon className="outlined">favorite</Icon>
            </IconButton>
            {fieldOptions.map((field) => (
              <IconButton
                key={field.key}
                sx={styles.icon(showedFields[field.key])}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowedFields({
                    ...showedFields,
                    [field.key]: !showedFields[field.key],
                  });
                  if (showedFields[field.key]) {
                    titleRef?.current?.focus();
                  } else {
                    setTimeout(
                      () => document.getElementById(field.key)?.focus(),
                      100
                    );
                  }
                }}
              >
                <Icon className="outlined">{field.icon}</Icon>
              </IconButton>
            ))}
            <Button
              variant="contained"
              size="small"
              sx={{ ml: "auto" }}
              onClick={handleSubmit}
            >
              <Icon>north</Icon>
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
