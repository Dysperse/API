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
    global.session.user.studentMode
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
                defaultValue={global.session && global.session.user.name}
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
                defaultValue={global.session && global.session.user.email}
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
                defaultValue={global.session && global.session.user.image}
                label="Profile picture"
                onBlur={(e) => updateSettings("image", e.target.value)}
              />
            }
          />
        </ListItem>
        <ListSubheader sx={{ background: "transparent" }}>
          What kind of home do you live in?
        </ListSubheader>
        {["Dorm", "Home", "Apartment"].map((plan: any, id: number) => (
          <ListItem
            key={id.toString()}
            onClick={() => {
              setMode(plan.toLowerCase());
              updateSettings("houseType", plan.toLowerCase());
            }}
            secondaryAction={
              <Radio
                edge="end"
                onChange={() => {
                  setMode(plan.toLowerCase());
                  updateSettings("houseType", plan.toLowerCase());
                }}
                checked={mode === plan.toLowerCase()}
              />
            }
            disablePadding
          >
            <ListItemButton sx={{ borderRadius: 4, transition: "none" }}>
              <ListItemText primary={plan} />
            </ListItemButton>
          </ListItem>
        ))}
      </Box>
    </>
  );
}
