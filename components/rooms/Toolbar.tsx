import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { blueGrey } from "@mui/material/colors";
import { SortMenu } from "./SortMenu";

export function Toolbar({ items, setItems, data }: any) {
  return (
    <Box sx={{ textAlign: "right", mb: 2 }}>
      <TextField
        placeholder="Search"
        id="outlined-size-small"
        onKeyDown={(e: any) => {
          if (e.code === "Enter") e.target.blur();
        }}
        onBlur={(e: any) => {
          if (e.target.value === "") {
            setItems(data);
            return;
          }
          setItems(
            data.filter((item) =>
              item.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.amount.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.categories.join(",").toLowerCase().includes(e.target.value.toLowerCase())
            )
          );
        }}
        size="small"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            borderRadius: "20px",
            border: "0!important",
            pb: 0.6,
            pt: 1,
            px: 2,
            background: blueGrey[50],
            "&.Mui-focused": {
              background: blueGrey[100],
            },
          },
        }}
        sx={{ verticalAlign: "middle" }}
      />
      <SortMenu />
    </Box>
  );
}
