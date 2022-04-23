import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { blue } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() =>
		document
			.querySelector(`meta[name="theme-color"]`)!
			.setAttribute("content", open ? "rgb(230,230,230)" : "#808080")
	);

	return (
		<div>
			<IconButton edge="end" aria-label="comments" onClick={handleClickOpen}>
				<span className="material-symbols-rounded">settings</span>
			</IconButton>

			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar
					sx={{
						boxShadow: 0,
						position: "sticky",
						background: "rgba(230,230,230,.5)",
						backdropFilter: "blur(10px)",
						py: 1,
						color: "#000"
					}}
				>
					<Toolbar>
						<IconButton
							edge="end"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
							sx={{ ml: -0.5 }}
						>
							<span className="material-symbols-rounded">close</span>{" "}
						</IconButton>
						<Typography sx={{ ml: 4, flex: 1 }} variant="h6" component="div">
							Settings
						</Typography>
					</Toolbar>
				</AppBar>
				<List>
					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">palette</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Appearance"
							secondary="Current theme: Blue"
						/>
					</ListItem>
					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">payments</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Finances"
							secondary="Manage your connected bank account"
						/>
					</ListItem>
					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">account_circle</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Profile"
							secondary="View and edit your account details"
						/>
					</ListItem>
					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">apps</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Connected apps"
							secondary="View and edit access to third-party apps"
						/>
					</ListItem>
					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">notifications</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Notifications"
							secondary="If an item's quantity is 10 or less"
						/>
					</ListItem>
					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">code</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Developer" secondary="Manage API keys" />
					</ListItem>
					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">smartphone</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="App"
							secondary="Download the Smartlist mobile and desktop app"
						/>
					</ListItem>
					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">history</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Login history"
							secondary="View previous logins to this account"
						/>
					</ListItem>
					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">sync</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Sync"
							secondary="Sync your account with up to 3 people"
						/>
					</ListItem>
					<Divider />

					<ListItem button>
						<ListItemAvatar>
							<Avatar sx={{ color: "#000", background: blue[100] }}>
								<span className="material-symbols-rounded">logout</span>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Sign out"
							secondary="Sign out of Smartlist and it's related apps"
						/>
					</ListItem>
					<ListItem button>
						<ListItemText primary="Legal" secondary="Food for lawyers" />
					</ListItem>
				</List>
			</Dialog>
		</div>
	);
}
