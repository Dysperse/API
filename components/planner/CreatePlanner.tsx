import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as colors from "@mui/material/colors";

export function CreatePlanner() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [mealType, setMealType] = useState("breakfast");

  const setMealTypeEvent = (event: SelectChangeEvent) => {
    setMealType(event.target.value as string);
  };
  useEffect(() => {
    if (open) setTimeout(() => setValue("meal"), 1000);
  }, [open]);
  return (
    <>
      <SwipeableDrawer
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        swipeAreaWidth={0}
        anchor="bottom"
        sx={{
          display: "flex",
          alignItems: { xs: "end", sm: "center" },
          height: "100vh",
          justifyContent: "center",
        }}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
            borderBottomRightRadius: { xs: 0, sm: "28px!important" },
            position: "unset",
            mx: "auto",
            maxWidth: { sm: "50vw", xs: "100vw" },
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ py: 6, px: 7 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "600" }}>
            Create
          </Typography>

          <FormControl sx={{ my: 2 }}>
            <FormLabel id="demo-controlled-radio-buttons-group">
              What are you planning?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="meal"
                control={<Radio />}
                label="a meal"
              />
              <FormControlLabel
                value="workout"
                control={<Radio />}
                label="a workout"
              />
              <FormControlLabel
                value="chores"
                control={<Radio />}
                label="chores"
              />
              <FormControlLabel
                value="something else"
                control={<Radio />}
                label="something else"
              />
            </RadioGroup>
          </FormControl>
          {value === "meal" ? (
            <>
              <TextField
                autoFocus
                label="What are you cooking?"
                variant="filled"
                fullWidth
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel variant="filled" id="demo-simple-select-label">
                  Type
                </InputLabel>
                <Select
                  MenuProps={{
                    BackdropProps: {
                      sx: { opacity: "0!important" },
                    },
                    anchorOrigin: {
                      vertical: "top",
                      horizontal: "center",
                    },
                    transformOrigin: {
                      vertical: "center",
                      horizontal: "center",
                    },
                    PaperProps: {
                      sx: {
                        px: 1,
                        borderRadius: 3,
                        background:
                          colors[themeColor][
                            global.theme === "dark" ? 900 : 100
                          ],
                      },
                    },
                    sx: {
                      "& .MuiMenuItem-root ": {
                        borderRadius: 3,
                        px: 3,
                        mb: 0.1,
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "rgba(200,200,200,.1)",
                        },
                      },
                      "& .Mui-selected": { pointerEvents: "none" },
                    },
                  }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={mealType}
                  variant="filled"
                  label="Age"
                  onChange={setMealTypeEvent}
                >
                  <MenuItem value={"breakfast"}>Breakfast</MenuItem>
                  <MenuItem value={"lunch"}>Lunch</MenuItem>
                  <MenuItem value={"dinner"}>Dinner</MenuItem>
                </Select>
              </FormControl>
            </>
          ) : (
            <></>
          )}
          <Button
            variant="contained"
            size="large"
            sx={{ float: "right", mt: 3, borderRadius: 4, boxShadow: "none" }}
          >
            Create
          </Button>
        </Box>
      </SwipeableDrawer>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ float: "right", borderRadius: 5, boxShadow: 0 }}
        size="large"
      >
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "10px" }}
        >
          add
        </span>
        Create
      </Button>
    </>
  );
}
