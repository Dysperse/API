import * as React from "react";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export function CustomRooms() {
  const fixedOptions = [
    "Kitchen",
    "Bedroom",
    "Bathroom",
    "Garage",
    "Living room",
    "Dining room",
    "Living room",
    "Laundry room",
    "Storage room",
    "Camping supplies",
    "Garden",
  ];
  const [value, setValue] = React.useState([...fixedOptions]);

  return (
    <Autocomplete
      multiple
      sx={{
        "& .MuiFilledInput-root": {
          pb: 2,
          px: 2,
        },
      }}
      freeSolo={true}
      id="fixed-tags-demo"
      value={value}
      onChange={(event: any, newValue: any) => {
        setValue([
          ...fixedOptions,
          ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
        ]);
      }}
      options={top100Films}
      getOptionLabel={(option: any) => option}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option}
            {...getTagProps({ index })}
            sx={{
              "&.Mui-disabled": {
                opacity: ".7!important",
              },
              "&.Mui-disabled *:not(.MuiChip-label)": {
                display: "none!important",
              },
            }}
            disabled={fixedOptions.indexOf(option.toString()) !== -1}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          placeholder="Add another room"
        />
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [];
