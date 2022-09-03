import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { updateSettings } from "./updateSettings";

export default function AppearanceSettings() {
  const [financePlan, setFinancePlan] = useState<
    "short-term" | "medium-term" | "long-term"
  >(global.user && global.user.financePlan);
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
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          // value={value}
          // onChange={handleChange}
        >
          <ListSubheader sx={{ background: "transparent" }}>
            Finance plan
          </ListSubheader>
          {[
            {
              s: "short-term",
              n: "Short term",
              d: "Save money for to acheive a certain goal in a quick period of time",
            },
            {
              s: "medium-term",
              n: "Medium term",
              d: "Save money for to acheive a set of goals in a moderate period of time",
            },
            {
              s: "long-term",
              n: "Long term",
              d: "Save money for for education/retirement in a lenient period of time",
            },
          ].map((plan: any, id: number) => (
            <ListItem
              key={id.toString()}
              onClick={() => {
                setFinancePlan(plan.s);
                updateSettings("financePlan", financePlan);
              }}
              secondaryAction={
                <Radio
                  edge="end"
                  onChange={() => {
                    setFinancePlan(plan.s);
                    updateSettings("financePlan", financePlan);
                  }}
                  checked={financePlan === plan.s}
                />
              }
              disablePadding
            >
              <ListItemButton sx={{ borderRadius: 4, transition: "none" }}>
                <ListItemText secondary={plan.d} primary={plan.n} />
              </ListItemButton>
            </ListItem>
          ))}
        </RadioGroup>
        <ListSubheader sx={{ background: "transparent" }}>
          Budgeting
        </ListSubheader>
        <ListItem>
          <ListItemText
            primary={
              <TextField
                fullWidth
                size="small"
                placeholder="daily expense limit"
                label="Daily limit"
                defaultValue={global.user && (global.user.budgetDaily ?? 0)}
                onBlur={(e) => updateSettings("budgetDaily", e.target.value)}
                id="outlined-start-adornment"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <TextField
                fullWidth
                size="small"
                placeholder="monthly expense limit"
                defaultValue={global.user && (global.user.budgetWeekly ?? 0)}
                label="Weekly limit"
                onBlur={(e) => updateSettings("budgetWeekly", e.target.value)}
                id="outlined-start-adornment"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <TextField
                fullWidth
                size="small"
                defaultValue={global.user && (global.user.budgetMonthly ?? 0)}
                label="Monthly limit"
                onBlur={(e) => updateSettings("budgetMonthly", e.target.value)}
                id="outlined-start-adornment"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            }
          />
        </ListItem>

        <ListSubheader sx={{ background: "transparent" }}>Other</ListSubheader>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 4, transition: "none" }}>
            <ListItemText
              secondary="Switch to another bank account. This will delete any previous transactions"
              primary="Switch bank account"
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 4, transition: "none" }}>
            <ListItemText
              secondary="This will disable Smartlist Finances and budgeting, however, you'll be able to access lessons."
              primary="Unlink bank account"
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </>
  );
}
