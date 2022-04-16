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
import Box from "@mui/material/Box";
import { blue } from "@mui/material/colors";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

import useScrollTrigger from "@mui/material/useScrollTrigger";

function ElevationScroll(props: any) {
	const { children, window } = props;
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
		target: window ? window() : undefined
	});
	if (document && document.querySelector(`meta[name="theme-color"]`)) {
		document
			.querySelector(`meta[name="theme-color"]`)!
			.setAttribute("content", trigger ? blue[50] : "#fff");
	}
	return React.cloneElement(children, {
		sx: trigger
			? {
					color: blue[900],
					py: {
						sm: 1,
						xs: 0.5
					},
					borderBottom: "1px solid transparent",
					transition: "all .2s",
					background: blue[50]
			  }
			: {
					color: "#000",
					py: {
						sm: 1,
						xs: 0.5
					},
					borderBottom: "1px solid #eee",
					transition: "all .2s",
					background: "#fff"
			  }
	});
}

export function Navbar({ handleDrawerToggle }: any): JSX.Element {
	return (
		<ElevationScroll>
			<AppBar elevation={0} position="fixed">
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
					<Box sx={{ display: { sm: "block", xs: "none" } }}>
						<Tooltip title="Search">
							<IconButton
								color="inherit"
								edge="end"
								size="large"
								sx={{ mr: 0.8 }}
							>
								<SearchIcon />
							</IconButton>
						</Tooltip>
					</Box>
					<Box sx={{ display: { sm: "block", xs: "none" } }}>
						<AppsMenu />
					</Box>
					<ProfileMenu />
				</Toolbar>
			</AppBar>
		</ElevationScroll>
	);
}
