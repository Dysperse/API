import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import MenuItem from "@mui/material/MenuItem";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import Grow from "@mui/material/Grow";
import { TransitionProps } from "@mui/material/transitions";
import Skeleton from "@mui/material/Skeleton";
import useFetch from "react-fetch-hook";

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Grow in={true} ref={ref} {...props} />;
});

function RoomList() {
	const { isLoading, data }: any = useFetch(
		"https://api.smartlist.tech/v2/lists/",
		{
			method: "POST",
			body: new URLSearchParams({
				token: global.session && global.session.accessToken
			}),
			headers: { "Content-Type": "application/x-www-form-urlencoded" }
		}
	);

	return isLoading ? (
		<>
			{[1, 2, 3, 4, 5, 6].map((_, __) => (
				<Skeleton
					key={Math.random().toExponential()}
					variant="text"
					animation="wave"
					sx={{ borderRadius: "28px" }}
				/>
			))}
		</>
	) : (
		<>
			<List sx={{ mt: -1 }}>
				{data.data.map((list: any) => (
					<ListItem disablePadding>
						<ListItemButton sx={{ borderRadius: 9, py: 0.5, px: 2 }}>
							<ListItemText primary={list.title} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</>
	);
}
export function AddToListModal({ handleClose }: any) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				sx={{
					backdropFilter: "blur(10px)",
					transition: "all .2s"
				}}
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
				PaperProps={{
					sx: {
						width: "400px",
						maxWidth: "calc(100vw - 20px)",
						borderRadius: "28px"
					}
				}}
			>
				<DialogTitle>
					Add to list
					<DialogContentText id="alert-dialog-slide-description" sx={{ mt: 1 }}>
						Choose a list
					</DialogContentText>
				</DialogTitle>
				<DialogContent>
					<RoomList />
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						disableElevation
						size="large"
						sx={{ borderRadius: 99, textTransform: "none", px: 3, py: 1 }}
						onClick={handleClose}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			<MenuItem disableRipple onClick={() => setOpen(true)}>
				<span class="material-symbols-rounded" style={{ marginRight: "10px" }}>
					receipt_long
				</span>
				Add to list
			</MenuItem>
		</>
	);
}
