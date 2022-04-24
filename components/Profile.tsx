import React, { useEffect } from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import Settings from "./Settings/index";

const drawerBleeding = 0;

const Root = styled("div")(({ theme }) => ({
	height: "100%"
}));

const StyledBox = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "light" ? "transparent" : grey[800]
}));

const Puller = styled(Box)(({ theme }) => ({
	width: 30,
	height: 6,
	backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
	borderRadius: 3,
	position: "absolute",
	top: 8,
	left: "calc(50% - 15px)"
}));

function Accounts({ setOpen }: any) {
	return (
		<List sx={{ width: "100%", bgcolor: "background.paper" }}>
			<ListItem
				secondaryAction={
					<div onClick={() => setOpen(false)}>
						<Settings />
					</div>
				}
			>
				<ListItemButton
					alignItems="flex-start"
					sx={{ borderRadius: 100, overflow: "hidden" }}
				>
					<ListItemAvatar>
						<Avatar
							alt="Remy Sharp"
							src={global.session ? global.session.user.image : null}
						/>
					</ListItemAvatar>
					<ListItemText
						primary={global.session && global.session.user.name}
						secondary={
							<React.Fragment>
								<Typography
									sx={{ display: "inline" }}
									component="span"
									variant="body2"
									color="text.primary"
								>
									{global.session && global.session.user.email}
								</Typography>
							</React.Fragment>
						}
					/>
				</ListItemButton>
			</ListItem>
		</List>
	);
}

export function ProfileMenu(props: any) {
	const { window } = props;
	const [open, setOpen] = React.useState(false);
	useEffect(() => {
		document.documentElement.classList[open ? "add" : "remove"](
			"prevent-scroll"
		);
		document
			.querySelector(`meta[name="theme-color"]`)!
			.setAttribute("content", open ? "#808080" : "#fff");
	}, [open]);
	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};

	// This is used only for the example
	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<Root>
			<CssBaseline />
			<Global
				styles={{
					".MuiDrawer-root > .MuiPaper-root": {
						height: "auto",
						overflow: "visible"
					}
				}}
			/>
			<Tooltip title="My account" placement="bottom-end">
				<IconButton
					onClick={toggleDrawer(true)}
					color="inherit"
					aria-label="open drawer."
					edge="end"
				>
					{global.session ? (
						<Avatar
							sx={{ fontSize: "15px", bgcolor: deepOrange[500] }}
							src={global.session.user.image}
						>
							{global.session.user.name}
						</Avatar>
					) : (
						<Skeleton
							variant="circular"
							animation="wave"
							width={40}
							height={40}
						/>
					)}
				</IconButton>
			</Tooltip>
			<SwipeableDrawer
				container={container}
				anchor="bottom"
				open={open}
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}
				swipeAreaWidth={drawerBleeding}
				disableSwipeToOpen={false}
				ModalProps={{
					keepMounted: true
				}}
				sx={{
					backdropFilter: "blur(10px)"
				}}
				PaperProps={{
					sx: {
						width: {
							xs: "calc(100vw - 20px)",
							sm: "50vw"
						},
						mb: "10px",
						ml: {
							xs: "10px",
							sm: "auto"
						},
						borderRadius: "15px",
						mx: "auto"
					}
				}}
			>
				<StyledBox
					sx={{
						top: 0,
						background: "transparent",
						borderRadius: 9,
						visibility: "visible",
						right: 0,
						left: 0
					}}
				>
					<Puller />
					<Typography sx={{ p: 2, color: "text.secondary" }}>
						Accounts
					</Typography>
				</StyledBox>
				<StyledBox
					sx={{
						px: 2,
						pb: 2,
						height: "100%",
						overflow: "auto"
					}}
				>
					<Accounts setOpen={setOpen} />
				</StyledBox>
			</SwipeableDrawer>
		</Root>
	);
}
