import * as React from "react";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AppsIcon from "@mui/icons-material/Apps";
import Tooltip from "@mui/material/Tooltip";
import TipsAndUpdates from "@mui/icons-material/TipsAndUpdates";
import { green } from "@mui/material/colors";

import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Link from "@mui/material/Link";
import Accordion from "@mui/material/Accordion";
import Box from "@mui/material/Box";

const categories = [
	{
		key: 1,
		label: "Smartlist",
		description: "Home inventory and finance management"
	},
	{
		key: 2,
		label: "Collaborate",
		description: "Plan events with collaborators in real-time"
	},
	{ label: "Recipes", description: "Recipe ideas based on your inventory" },
	{
		key: 3,
		label: "Availability",
		description: "Find the best time for a group to get together"
	},
	{
		key: 4,
		label: "Dressing",
		description: "Match dress sizes which fit you in multiple stores"
	},
	{
		key: 5,
		bg: green[100],
		href: "https://smartlist.tech/discord",
		label: (
			<Box sx={{ color: green[800] }}>
				<TipsAndUpdates
					sx={{ verticalAlign: "middle", mr: 1, transform: "scale(.8)" }}
				/>
				Suggest an app
			</Box>
		),
		description: "Have any ideas for apps? Let us know!"
	}
];

function Products() {
	const [expanded, setExpanded] = React.useState(1);

	const handleChange = (panel: any) => {
		setExpanded(panel);
	};

	return (
		<div
			onMouseLeave={() => {
				handleChange(1);
			}}
			onBlur={() => {
				handleChange(1);
			}}
		>
			{categories.map((category) => (
				<Accordion
					square
					sx={{
						boxShadow: 0,
						margin: "0!important",
						borderRadius: "9px",
						"&:hover, &.Mui-expanded": {
							background: category.bg ?? "#e9eef0"
						},
						transition: "all .2s",
						"&:before": {
							display: "none"
						},
						"& .MuiAccordionDetails-root": {
							opacity: 0,
							transform: "scale(.95)",
							transition: "all .3s"
						},
						"&:hover .MuiAccordionDetails-root, &.Mui-expanded .MuiAccordionDetails-root": {
							opacity: 1,
							transform: "scale(1)"
						}
					}}
					expanded={expanded === category.key}
					// onChange={handleChange(category.key)}
					onMouseOver={() => handleChange(category.key)}
					onClick={() => handleChange(category.key)}
					onFocus={() => handleChange(category.key)}
				>
					<AccordionSummary
						aria-controls="panel1d-content"
						id="panel1d-header"
						sx={{
							minHeight: "35px!important",
							maxHeight: "35px!important"
						}}
					>
						<Link
							underline="none"
							target="_blank"
							href={category.href}
							component="button"
							sx={{ fontSize: "16px" }}
						>
							{category.label}
						</Link>
					</AccordionSummary>
					<AccordionDetails sx={{ pb: 1, pt: 0 }}>
						<Link
							underline="none"
							target="_blank"
							href={category.href}
							component="button"
							sx={{ fontSize: "16px" }}
						>
							<Typography variant="body2" sx={{ color: "#505050" }}>
								{category.description}
							</Typography>
						</Link>
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
}

export function AppsMenu() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Tooltip title="Apps">
				<IconButton
					color="inherit"
					edge="end"
					size="large"
					sx={{ mr: 0.8 }}
					onClick={handleClick}
				>
					<AppsIcon />
				</IconButton>
			</Tooltip>
			<Menu
				id="demo-positioned-menu"
				aria-labelledby="demo-positioned-button"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				PaperProps={{
					sx: {
						borderRadius: "28px",
						boxShadow: 2
					}
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
				<Box sx={{ px: 2, py: 1 }}>
					<Typography sx={{ my: 1.5, ml: 1.5 }} variant="h6">
						Apps
					</Typography>
					<Products />
				</Box>
			</Menu>
		</div>
	);
}
