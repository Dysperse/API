import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Skeleton from "@mui/material/Skeleton";
import Collapse from "@mui/material/Collapse";

function ListItem({ item }: any) {
	const [deleted, setDeleted] = useState(false);

	return (
		<Collapse in={!deleted}>
			<FormControlLabel
				control={
					<Checkbox
						disabled={deleted}
						onInput={() => {
							setDeleted(true);
						}}
					/>
				}
				label={item.title}
				sx={{ m: 0, display: "block" }}
			/>
		</Collapse>
	);
}

function ListPopup({ listItems, title, id, drawerState, setDrawerState }: any) {
	return (
		<SwipeableDrawer
			anchor="bottom"
			swipeAreaWidth={0}
			disableSwipeToOpen={true}
			PaperProps={{
				sx: {
					width: {
						sm: "50vw"
					},
					maxHeight: "80vh",
					borderRadius: "40px 40px 0 0",
					mx: "auto"
				}
			}}
			open={drawerState}
			onClose={() => setDrawerState(false)}
			onOpen={() => setDrawerState(false)}
		>
			<div
				style={{
					textAlign: "center",
					borderBottom: "1px solid #eee"
				}}
			>
				<Typography
					gutterBottom
					variant="h5"
					component="div"
					sx={{ mt: 4, mb: 2 }}
				>
					{title}
				</Typography>
				<Button size="small" sx={{ mr: 1, mb: 3 }} variant="contained">
					Create item
				</Button>
				<Button size="small" sx={{ mb: 3 }} variant="outlined">
					Delete list
				</Button>
			</div>
			<Box sx={{ p: 3, textAlign: "center", overflow: "scroll" }}>
				{listItems.loading ? (
					<>
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
					</>
				) : (
					<div style={{ textAlign: "left", display: "block" }}>
						{listItems.data.data.length === 0 ? (
							<Box sx={{ textAlign: "center", opacity: ".5" }}>
								<Typography variant="h3" sx={{ mb: 2 }}>
									¯\_(ツ)_/¯
								</Typography>
								<Typography variant="h5">No items yet...</Typography>
							</Box>
						) : null}
						{listItems.data.data.map((item:any) => (
							<ListItem item={item} />
						))}
					</div>
				)}
			</Box>
		</SwipeableDrawer>
	);
}

export function List({
	title,
	description,
	id
}: {
	title: string;
	description: string;
	id: number;
}) {
	const [drawerState, setDrawerState] = React.useState(false);
	const [listItems, setlistItems] = useState({
		data: "",
		loading: true
	});

	const getListItems = async (id: number) => {
		const data = await fetch("https://api.smartlist.tech/v2/lists/fetch/", {
			method: "POST",
			body: new URLSearchParams({
				token: ACCOUNT_DATA.accessToken,
				parent: id.toString()
			})
		});
		const e = await data.json();

		setlistItems({
			data: e,
			loading: false
		});
	};
	return (
		<>
			<ListPopup
				title={title}
				id={id}
				listItems={listItems}
				drawerState={drawerState}
				setDrawerState={setDrawerState}
			/>
			<Card sx={{ mb: 1, width: "100%" }}>
				<CardActionArea
					onClick={() => {
						setDrawerState(true);
						getListItems(id);
					}}
				>
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							{title}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{description}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</>
	);
}
