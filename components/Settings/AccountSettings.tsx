import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Radio from "@mui/material/Radio";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { updateSettings } from "./updateSettings";

export default function AppearanceSettings() {
  const [mode, setMode] = useState<"personal" | "business">("personal");
  const [studentMode, setStudentMode] = useState<boolean>(false);

  useEffect(() => {
    updateSettings("studentMode", studentMode ? "true" : "false");
  }, [studentMode]);

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
        <ListSubheader sx={{ background: "transparent" }}>
          Account
        </ListSubheader>
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
          What are you using Smartlist for?
        </ListSubheader>
        {[
          {
            s: "personal",
            n: "Personal",
          },
          {
            s: "business",
            n: "Business",
          },
        ].map((plan: any, id: number) => (
          <ListItem
            key={id.toString()}
            onClick={() => {
              setMode(plan.s);
              updateSettings("purpose", plan.s);
            }}
            secondaryAction={
              <Radio
                edge="end"
                onChange={() => {
                  setMode(plan.s);
                  updateSettings("purpose", plan.s);
                }}
                checked={mode === plan.s}
              />
            }
            disablePadding
          >
            <ListItemButton sx={{ borderRadius: 4, transition: "none" }}>
              <ListItemText primary={plan.n} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListSubheader sx={{ background: "transparent" }}>
          Student mode
        </ListSubheader>
        <ListItem
          onClick={() => setStudentMode(!studentMode)}
          secondaryAction={
            <Switch
              edge="end"
              onChange={(e) => {
                setStudentMode(!studentMode);
              }}
              checked={studentMode}
            />
          }
          disablePadding
        >
          <ListItemButton sx={{ borderRadius: 4, transition: "none" }}>
            <ListItemText primary="Student mode" />
          </ListItemButton>
        </ListItem>

        <ListSubheader sx={{ background: "transparent" }}>
          Home profile
        </ListSubheader>
        <ListItem>
          <ListItemText
            primary={
              <TextField
                fullWidth
                variant="filled"
                defaultValue={global.session && global.session.user.houseName}
                label="What's your home's name?"
                onBlur={(e) => updateSettings("houseName", e.target.value)}
              />
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="How many people do you live with?"
            secondary={
              <Slider
                aria-label="How many people do you live with?"
                defaultValue={
                  global.session && parseInt(global.session.user.familyCount)
                }
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={15}
                onChangeCommitted={(_, newValue) =>
                  updateSettings("familyCount", newValue.toString())
                }
              />
            }
          />
        </ListItem>
      </Box>
    </>
  );
}
