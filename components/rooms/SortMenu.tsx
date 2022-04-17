import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FilterListIcon from "@mui/icons-material/FilterList";

export function SortMenu() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				id="basic-button"
				variant="contained"
				disableElevation
				sx={{
					borderRadius: 10,
					textTransform: "none",
					ml: 1,
					py: 1,
					verticalAlign: "middle"
				}}
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			>
				<FilterListIcon sx={{ mr: 1.5 }} />
				Sort by
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button"
				}}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
			>
				<MenuItem onClick={handleClose}>A-Z</MenuItem>
				<MenuItem onClick={handleClose}>Z-A</MenuItem>
				<MenuItem onClick={handleClose}>Last updated</MenuItem>
			</Menu>
		</>
	);
}
