import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export default function AppearanceSettings() {
	return (
		<>
			<Box
				sx={{
					py: 1,
					px: {
						sm: 10
					}
				}}
			>
				<RadioGroup
					aria-labelledby="demo-controlled-radio-buttons-group"
					name="controlled-radio-buttons-group"
					// value={value}
					// onChange={handleChange}
				>
					<ListItem
						onClick={() => global.setTheme("light")}
						secondaryAction={
							<Radio
								edge="end"
								onChange={() => global.setTheme("light")}
								checked={global.theme === "light"}
							/>
						}
						disablePadding
					>
						<ListItemButton>
							<ListItemText primary="Light" />
						</ListItemButton>
					</ListItem>
					<ListItem
						onClick={() => global.setTheme("dark")}
						secondaryAction={
							<Radio
								edge="end"
								onChange={() => global.setTheme("dark")}
								checked={global.theme === "dark"}
							/>
						}
						disablePadding
					>
						<ListItemButton>
							<ListItemText primary="Dark" />
						</ListItemButton>
					</ListItem>
				</RadioGroup>
			</Box>
		</>
	);
}
