import React, { useEffect } from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import { CreateItemModal } from "./CreateItemModal";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import GarageIcon from "@mui/icons-material/Garage";
import DiningIcon from "@mui/icons-material/Dining";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import BathroomIcon from "@mui/icons-material/Bathroom";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LivingIcon from "@mui/icons-material/Living";

const Root = styled("div")(({ theme }) => ({
	height: "100%"
}));

function AddItemOption({ toggleDrawer, icon, title }: any): JSX.Element {
	return (
		<Grid item xs={3}>
			<CreateItemModal room={title} toggleDrawer={toggleDrawer}>
				<Card sx={{ textAlign: "center", boxShadow: 0, borderRadius: 6 }}>
					<CardActionArea onClick={() => toggleDrawer(false)}>
						<CardContent sx={{ p: 1 }}>
							<Typography variant="h4">{icon}</Typography>
							<Typography variant="body2">{title}</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</CreateItemModal>
		</Grid>
	);
}
function Content({ toggleDrawer }: any) {
	return (
		<List sx={{ width: "100%", bgcolor: "background.paper" }}>
			<Grid container sx={{ px: 1 }}>
				<AddItemOption
					toggleDrawer={toggleDrawer}
					title="Kitchen"
					icon={<MicrowaveIcon />}
				/>
				<AddItemOption
					toggleDrawer={toggleDrawer}
					title="Bathroom"
					icon={<BathroomIcon />}
				/>
				<AddItemOption
					toggleDrawer={toggleDrawer}
					title="Bedroom"
					icon={<BedroomParentIcon />}
				/>
				<AddItemOption
					toggleDrawer={toggleDrawer}
					title="Garage"
					icon={<GarageIcon />}
				/>
				<AddItemOption
					toggleDrawer={toggleDrawer}
					title="Living room"
					icon={<LivingIcon />}
				/>
				<AddItemOption
					toggleDrawer={toggleDrawer}
					title="Dining room"
					icon={<DiningIcon />}
				/>
				<AddItemOption
					toggleDrawer={toggleDrawer}
					title="Laundry room"
					icon={<LocalLaundryServiceIcon />}
				/>
				<AddItemOption
					toggleDrawer={toggleDrawer}
					title="Storage room"
					icon={<Inventory2Icon />}
				/>
			</Grid>
		</List>
	);
}
function Puller() {
	return (
		<Box
			className="puller"
			sx={{
				width: "50px",
				backgroundColor: "#eee",
				height: "7px",
				margin: "auto",
				borderRadius: 9,
				mt: 1,
				position: "absolute",
				left: "50%",
				transform: "translateX(-50%)",
				display: "inline-block"
			}}
		/>
	);
}

export default function AddPopup(props: any) {
	const [open, setOpen] = React.useState(false);
	useEffect(() => {
		document.documentElement.classList[open ? "add" : "remove"](
			"prevent-scroll"
		);
		document
			.querySelector(`meta[name="theme-color"]`)!
			.setAttribute("content", open ? "#808080" : "#fff");
	});
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
				sx={{
					backdropFilter: "blur(20px)"
				}}
				anchor="bottom"
				swipeAreaWidth={0}
				PaperProps={{
					sx: {
						width: {
							sm: "50vw",
							xs: "calc(100% - 30px)"
						},
						"& *:not(.MuiTouchRipple-child, .puller)": {
							background: "transparent!important"
						},
						borderRadius: "28px!important",
						mb: "15px",
						mx: {
							sm: "auto",
							xs: "15px"
						}
					}
				}}
				open={open}
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}
				ModalProps={{
					keepMounted: true,
					sx: {
						backdropFilter: "blur(20px)"
					}
				}}
			>
				<Puller />
				<Typography
					sx={{ textAlign: "center", mt: 3.5, color: "text.secondary" }}
				>
					Create
				</Typography>
				<Content toggleDrawer={toggleDrawer} />
			</SwipeableDrawer>
		</Root>
	);
}
