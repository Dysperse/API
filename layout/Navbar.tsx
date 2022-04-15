import * as React from "react";

import { ProfileMenu } from "./Profile";
import { AppsMenu } from "./AppsMenu";
import { NotificationsMenu } from "./Notifications";
import AppBar from "@mui/material/AppBar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { blue } from "@mui/material/colors";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

export function Navbar({ handleDrawerToggle }: any): JSX.Element {
	return (
		<AppBar
			position="fixed"
			elevation={0}
			sx={{
				color: blue[900],
				py: 1,
				background: blue[50]
			}}
		>
			<Toolbar>
				<Tooltip title="Menu" placement="bottom-start">
					<IconButton
						color="inherit"
						aria-label="open drawer."
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>
				</Tooltip>
				<Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
					{global.ACCOUNT_DATA.houseName}
				</Typography>
				<NotificationsMenu>
					<Tooltip title="Notifications">
						<IconButton
							color="inherit"
							edge="end"
							size="large"
							sx={{ mr: 0.8 }}
						>
							<NotificationsIcon />
						</IconButton>
					</Tooltip>
				</NotificationsMenu>
				<Tooltip title="Search">
					<IconButton color="inherit" edge="end" size="large" sx={{ mr: 0.8 }}>
						<SearchIcon />
					</IconButton>
				</Tooltip>
				<AppsMenu />
				<ProfileMenu />
			</Toolbar>
		</AppBar>
	);
}
