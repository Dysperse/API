import React, { useEffect } from "react";

import { ProfileMenu } from "./Profile";
import { AppsMenu } from "./AppsMenu";
import { NotificationsMenu } from "./Notifications";
import AppBar from "@mui/material/AppBar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { blue, grey } from "@mui/material/colors";

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
	useEffect(() => {
		if (document && document.querySelector(`meta[name="theme-color"]`)) {
			document
				.querySelector(`meta[name="theme-color"]`)!
				.setAttribute(
					"content",
					trigger
						? global.theme === "dark"
							? grey[800]
							: blue[100]
						: global.theme === "dark"
						? "#121212"
						: "#fff"
				);
		}
	});
	return React.cloneElement(children, {
		sx: trigger
			? {
					color: global.theme === "dark" ? "white" : "black",
					py: {
						sm: 1,
						xs: 0.5
					},
					transition: "all .2s",
					background:
						global.theme === "dark"
							? "rgba(90,90,90,.7)"
							: "rgba(187, 222, 251, .7)",
					backdropFilter: "blur(20px)"
			  }
			: {
					color: global.theme === "dark" ? "white" : "black",
					py: {
						sm: 1,
						xs: 0.5
					},
					transition: "all .2s",
					background:
						global.theme === "dark" ? "rgba(0,0,0,0)" : "rgba(255,255,255,.5)",
					backdropFilter: "blur(10px)"
			  }
	});
}

export function Navbar({ handleDrawerToggle }: any): JSX.Element {
	return (
		<ElevationScroll>
			<AppBar elevation={0} position="fixed">
				<Toolbar>
					<Tooltip title="Menu" placement="bottom-start">
						{global.session ? (
							<IconButton
								color="inherit"
								aria-label="open drawer."
								edge="start"
								size="large"
								onClick={handleDrawerToggle}
								sx={{ mr: 2, ml: -0.5, display: { sm: "none" } }}
							>
								<span className="material-symbols-rounded">menu</span>
							</IconButton>
						) : (
							<Skeleton
								sx={{ mr: 2 }}
								variant="circular"
								width={40}
								height={40}
								animation="wave"
							/>
						)}
					</Tooltip>

					<Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
						{global.session ? (
							global.session.user.houseName || "Smartlist"
						) : (
							<Skeleton
								animation="wave"
								width={200}
								sx={{ maxWidth: "20vw" }}
							/>
						)}
					</Typography>
					<NotificationsMenu>
						<Tooltip title="Notifications">
							{global.session ? (
								<IconButton
									color="inherit"
									edge="end"
									size="large"
									sx={{ mr: 0.8 }}
								>
									<span className="material-symbols-rounded">
										notifications
									</span>
								</IconButton>
							) : (
								<Skeleton
									variant="circular"
									width={40}
									sx={{ mr: 2 }}
									height={40}
									animation="wave"
								/>
							)}
						</Tooltip>
					</NotificationsMenu>
					<Box sx={{ display: { sm: "block", xs: "none" } }}>
						<Tooltip title="Search">
							{global.session ? (
								<IconButton
									color="inherit"
									edge="end"
									size="large"
									sx={{ mr: 0.8 }}
								>
									<span className="material-symbols-rounded">search</span>
								</IconButton>
							) : (
								<Skeleton
									sx={{ mr: 2 }}
									variant="circular"
									width={40}
									height={40}
									animation="wave"
								/>
							)}
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
