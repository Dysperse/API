import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { blueGrey } from "@mui/material/colors";
import { SortMenu } from "./SortMenu";

export function Toolbar() {
	return (
		<Box sx={{ textAlign: "right", mb: 2 }}>
			<TextField
				placeholder="Search"
				id="outlined-size-small"
				size="small"
				InputProps={{
					disableUnderline: true,
					sx: {
						borderRadius: "20px",
						border: "0!important",
						py: 0,
						px: 1,
						background: blueGrey[50],
						"&:focus": {
							background: blueGrey[200]
						}
					}
				}}
				sx={{ verticalAlign: "middle" }}
			/>
			<SortMenu />
		</Box>
	);
}
