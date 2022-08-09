import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import * as React from "react";

export function CustomRooms({ houseType }: any) {
  const fixedOptions = [
    ...(houseType === "dorm" ? [] : ["Kitchen"]),
    "Bedroom",
    "Bathroom",
    ...(houseType === "home" ? ["Garage"] : []),
    "Living room",
    ...(houseType === "dorm" ? [] : ["Dining room"]),
    ...(houseType === "dorm" ? [] : ["Laundry room"]),
    "Storage room",
    ...(houseType === "dorm" ? [] : ["Camping Supplies"]),
    ...(houseType === "dorm" ? [] : ["Garden"]),
  ];
  React.useEffect(() => {
    setValue(fixedOptions);
  }, [houseType]);
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
          <React.Fragment key={index}>
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
          </React.Fragment>
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
