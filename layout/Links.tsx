import React from "react";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { blue } from "@mui/material/colors";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

const AddIcon: any = dynamic(() => import("@mui/icons-material/Add"));
const RoomIcon: any = dynamic(() => import("@mui/icons-material/Room"));
const LabelIcon: any = dynamic(() => import("@mui/icons-material/Label"));
const ExpandLess: any = dynamic(() => import("@mui/icons-material/ExpandLess"));
const ExpandMore: any = dynamic(() => import("@mui/icons-material/ExpandMore"));
const SpaIcon: any = dynamic(() => import("@mui/icons-material/Spa"));

function CreateRoom() {
	const [open, setOpen] = React.useState(false);

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};

	return (
		<>
			<ListItemButton sx={{ pl: 4 }} onClick={toggleDrawer(true)}>
				<ListItemIcon>
					<AddIcon />
				</ListItemIcon>
				<ListItemText primary="Create room" />
			</ListItemButton>
			<SwipeableDrawer
				anchor="bottom"
				PaperProps={{
					sx: {
						width: {
							sm: "50vw"
						},
						borderRadius: "40px 40px 0 0",
						mx: "auto"
					}
				}}
				open={open}
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}
				ModalProps={{
					keepMounted: true
				}}
			>
				<DialogTitle sx={{ mt: 2, textAlign: "center" }}>
					Create list
				</DialogTitle>
				<Box sx={{ p: 3 }}>
					<TextField
						inputRef={(input) => setTimeout(() => input && input.focus(), 100)}
						margin="dense"
						label="Room name"
						fullWidth
						autoComplete={"off"}
						name="name"
						variant="filled"
					/>

					<LoadingButton
						sx={{ mt: 1, float: "right" }}
						color="primary"
						type="submit"
						loading={false}
						// onClick={() => setTimeout(setClickLoading, 10)}
						variant="outlined"
					>
						Create
					</LoadingButton>
					<Button
						sx={{ mt: 1, mr: 1, float: "right" }}
						color="primary"
						type="button"
						onClick={() => {
							// setLoading(false);
							// setOpen(false);
						}}
					>
						Back
					</Button>
				</Box>
			</SwipeableDrawer>
		</>
	);
}

const ListItem = React.memo(function ListItem({
	href = "/dashboard",
	asHref = "/dashboard",
	text,
	icon
}: any) {
	const router = useRouter();

	return (
		<Link href={href} as={asHref} replace>
			<ListItemButton
				sx={{
					borderRadius: "0 20px 20px 0",
					...(router.asPath === asHref && {
						backgroundColor: blue[50],
						transition: "all .2s",
						color: blue[700],
						"&:hover": {
							backgroundColor: blue[100],
							color: blue[800]
						},
						"& svg": {
							transition: "all .2s"
						},
						"&:hover svg": {
							color: blue[700] + "!important"
						}
					})
				}}
			>
				<ListItemIcon
					sx={{
						...(router.asPath === asHref && {
							color: blue[500]
						})
					}}
				>
					{icon}
				</ListItemIcon>
				<ListItemText primary={text} />
			</ListItemButton>
		</Link>
	);
});

export function DrawerListItems({ handleDrawerToggle, customRooms }: any) {
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<List
			sx={{ width: "100%" }}
			component="nav"
			aria-labelledby="nested-list-subheader"
		>
			<Box
				sx={{
					display: {
						xs: "none",
						sm: "block"
					},
					pt: 1
				}}
			>
				<Toolbar />
			</Box>
			<div onClick={handleDrawerToggle}>
				<ListSubheader>Home</ListSubheader>
				<ListItem text="Overview" icon={<LabelIcon />} />
				<ListItem
					href="/finances"
					asHref="/finances"
					text="Finances"
					icon={<LabelIcon />}
				/>
				<ListItem
					asHref="/meals"
					href="/meals"
					text="Meals"
					icon={<LabelIcon />}
				/>
				{/* <ListItem href="/meals" text="Eco-friendly tips" icon={<SpaIcon />} /> */}
			</div>
			<div onClick={handleDrawerToggle}>
				<ListSubheader>Rooms</ListSubheader>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/kitchen"
					text="Kitchen"
					icon={<LabelIcon />}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/bedroom"
					text="Bedroom"
					icon={<LabelIcon />}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/bathroom"
					text="Bathroom"
					icon={<LabelIcon />}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/garage"
					text="Garage"
					icon={<LabelIcon />}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/dining"
					text="Dining room"
					icon={<LabelIcon />}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/living-room"
					text="Living room"
					icon={<LabelIcon />}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/laundry-room"
					text="Laundry room"
					icon={<LabelIcon />}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/storage-room"
					text="Storage room"
					icon={<LabelIcon />}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/camping"
					text="Camping"
					icon={<LabelIcon />}
				/>
				<ListItem
					href="/rooms/[index]"
					asHref="/rooms/garden"
					text="Garden"
					icon={<LabelIcon />}
				/>
			</div>

			<ListItemButton onClick={handleClick}>
				<ListItemIcon>
					<RoomIcon />
				</ListItemIcon>
				<ListItemText primary="More rooms" />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>
			<Collapse
				in={open}
				timeout="auto"
				unmountOnExit
				onClick={handleDrawerToggle}
			>
				<List component="div" disablePadding>
					{customRooms}
					<CreateRoom />
				</List>
			</Collapse>
			<ListSubheader component="div" id="nested-list-subheader">
				More
			</ListSubheader>
			<ListItem
				href="/notes"
				asHref="/notes"
				text="Notes"
				icon={<LabelIcon />}
			/>
			<ListItem text="Home maintenance" icon={<LabelIcon />} />
			<ListItem
				href="/starred"
				asHref="/starred"
				text="Starred items"
				icon={<LabelIcon />}
			/>
			<ListItem
				href="/trash"
				asHref="/trash"
				text="Trash"
				icon={<LabelIcon />}
			/>
		</List>
	);
}
