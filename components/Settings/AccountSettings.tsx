import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Radio from "@mui/material/Radio";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { updateSettings } from "./updateSettings";

export default function AppearanceSettings() {
  const [mode, setMode] = useState<"personal" | "business">("personal");
  const [studentMode, setStudentMode] = useState<boolean>(
    global.property.houseType
  );

  return (
    <>
      <Box
        sx={{
          py: 1,
          px: {
            sm: 10,
          },
        }}
      >
        <ListItem>
          <ListItemText
            primary={
              <TextField
                fullWidth
                variant="filled"
                defaultValue={global.user && global.user.name}
                label="Name"
                onBlur={(e) => updateSettings("name", e.target.value)}
              />
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <TextField
                fullWidth
                disabled
                variant="filled"
                defaultValue={global.user && global.user.email}
                label="Email"
                onBlur={(e) => updateSettings("email", e.target.value)}
              />
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <TextField
                fullWidth
                variant="filled"
                defaultValue={global.user && global.user.image}
                label="Profile picture"
                onBlur={(e) => updateSettings("image", e.target.value)}
              />
            }
          />
        </ListItem>
      </Box>
    </>
  );
}
