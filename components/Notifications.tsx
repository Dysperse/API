import * as React from "react";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import Tooltip from "@mui/material/Tooltip";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

function NotificationsList() {
	return (
		<List sx={{ width: "100%", bgcolor: "background.paper" }}>
			<ListItem alignItems="flex-start">
				<ListItemAvatar>
					<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
				</ListItemAvatar>
				<ListItemText
					primary="Brunch this weekend?"
					secondary={
						<React.Fragment>
							<Typography
								sx={{ display: "inline" }}
								component="span"
								variant="body2"
								color="text.primary"
							>
								Ali Connors
							</Typography>
							{" — I'll be in your basement doing errands this…"}
						</React.Fragment>
					}
				/>
			</ListItem>
			{[1, 1, 1, 1, 1, 1, 1, 1].map((_) => (
				<>
					<Divider variant="inset" component="li" />
					<ListItem alignItems="flex-start">
						<ListItemAvatar>
							<Avatar alt="John Doe" />
						</ListItemAvatar>
						<ListItemText
							primary="John doe"
							secondary={
								<React.Fragment>
									<Typography
										sx={{ display: "inline" }}
										component="span"
										variant="body2"
										color="text.primary"
									>
										Sandra Adams
									</Typography>
									{" — Do you have Paris recommendations? Have you ever..."}
								</React.Fragment>
							}
						/>
					</ListItem>
				</>
			))}
		</List>
	);
}

export function NotificationsMenu(props: any): JSX.Element {
	const [state, setState] = React.useState(false);

	return (
		<>
			<div onClick={() => setState(true)}>{props.children}</div>
			<SwipeableDrawer
				anchor={"right"}
				sx={{ backdropFilter: "blur(10px)" }}
				open={state}
				onOpen={() => setState(true)}
				onClose={() => setState(false)}
			>
				<Box sx={{ flexGrow: 1, position: "relative" }}>
					<AppBar
						elevation={0}
						position="sticky"
						sx={{ background: "#fff", color: "#404040" }}
					>
						<Toolbar>
							<Tooltip title="Back">
								<IconButton
									size="large"
									edge="start"
									color="inherit"
									onClick={() => setState(false)}
									aria-label="menu"
									sx={{ mr: 2 }}
								>
									<span className="material-symbols-rounded">chevron_left</span>
								</IconButton>
							</Tooltip>
							<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
								Notifications
							</Typography>
						</Toolbar>
					</AppBar>
				</Box>
				<Box
					sx={{
						height: "100vh",
						overflowY: "scroll",
						width: "500px",
						maxWidth: "100vw",
						px: 3
					}}
					role="presentation"
				>
					<NotificationsList />
					<Toolbar />
				</Box>
			</SwipeableDrawer>
		</>
	);
}
