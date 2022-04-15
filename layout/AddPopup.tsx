import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { CreateItemModal } from "./CreateItemModal";
import LabelIcon from "@mui/icons-material/Label";

const Root = styled("div")(({ theme }) => ({
	height: "100%"
}));

function AddItemOption({ toggleDrawer, icon, title }: any): JSX.Element {
	return (
		<CreateItemModal room={title} toggleDrawer={toggleDrawer}>
			<ListItemButton onClick={() => toggleDrawer(false)}>
				<ListItemIcon>{icon}</ListItemIcon>
				<ListItemText primary={title} />
			</ListItemButton>
		</CreateItemModal>
	);
}
function Content({ toggleDrawer }: any) {
	return (
		<List sx={{ width: "100%", bgcolor: "background.paper" }}>
			<AddItemOption
				toggleDrawer={toggleDrawer}
				title="Kitchen"
				icon={<LabelIcon />}
			/>
			<AddItemOption
				toggleDrawer={toggleDrawer}
				title="Bathroom"
				icon={<LabelIcon />}
			/>
			<AddItemOption
				toggleDrawer={toggleDrawer}
				title="Bedroom"
				icon={<LabelIcon />}
			/>
			<AddItemOption
				toggleDrawer={toggleDrawer}
				title="Garage"
				icon={<LabelIcon />}
			/>
			<AddItemOption
				toggleDrawer={toggleDrawer}
				title="Living room"
				icon={<LabelIcon />}
			/>
			<AddItemOption
				toggleDrawer={toggleDrawer}
				title="Dining room"
				icon={<LabelIcon />}
			/>
			<AddItemOption
				toggleDrawer={toggleDrawer}
				title="Laundry room"
				icon={<LabelIcon />}
			/>
			<AddItemOption
				toggleDrawer={toggleDrawer}
				title="Storage room"
				icon={<LabelIcon />}
			/>
		</List>
	);
}

export default function AddPopup(props: any) {
	const { window } = props;
	const [open, setOpen] = React.useState(false);

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};

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
			<Box onClick={toggleDrawer(true)}>{props.children}</Box>

			<SwipeableDrawer
				anchor="bottom"
				swipeAreaWidth={0}
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
				<Typography sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
					Create
				</Typography>
				<Content toggleDrawer={toggleDrawer} />
			</SwipeableDrawer>
		</Root>
	);
}
