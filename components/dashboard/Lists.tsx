import React, { useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { blue, blueGrey, grey } from "@mui/material/colors";
import { List } from "./List";

function CreateListCard() {
	const [open, setOpen] = useState(false);
	useEffect(() => {
		document.documentElement.classList[open ? "add" : "remove"](
			"prevent-scroll"
		);
		document
			.querySelector(`meta[name="theme-color"]`)!
			.setAttribute(
				"content",
				open
					? global.theme === "dark"
						? "#101010"
						: "#808080"
					: document.documentElement!.scrollTop === 0
					? "#fff"
					: blue[100]
			);
	});
	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};

	return (
		<>
			<Card
				sx={{
					boxShadow: 0,
					mb: 2,
					borderRadius: "28px",
					width: "100%",
					textAlign: "center",
					background: global.theme === "dark" ? grey[800] : blueGrey[100],
					"& *": { transition: "all .05s !important" }
				}}
			>
				<CardActionArea
					onClick={toggleDrawer(true)}
					sx={{ transition: "none!important" }}
				>
					<CardContent>
						<AddCircleIcon sx={{ my: 1 }} />
						<Typography gutterBottom variant="h5" component="div">
							Create list
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
			<SwipeableDrawer
				open={open}
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
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}
				ModalProps={{
					keepMounted: true
				}}
				swipeAreaWidth={0}
			>
				<DialogTitle sx={{ mt: 2, textAlign: "center" }}>
					Create list
				</DialogTitle>
				<Box sx={{ p: 3 }}>
					<TextField
						inputRef={(input) => setTimeout(() => input && input.focus(), 100)}
						margin="dense"
						label="Title"
						fullWidth
						autoComplete="off"
						name="title"
						variant="filled"
					/>
					<TextField
						margin="dense"
						label="Description"
						fullWidth
						autoComplete="off"
						name="title"
						variant="filled"
					/>

					<LoadingButton
						sx={{ mt: 1, float: "right" }}
						color="primary"
						type="submit"
						loading={false}
						variant="outlined"
					>
						Create
					</LoadingButton>
					<Button
						sx={{ mt: 1, mr: 1, float: "right" }}
						color="primary"
						type="button"
					>
						Back
					</Button>
				</Box>
			</SwipeableDrawer>
		</>
	);
}

export function Lists() {
	const { isLoading, data }: any = useFetch(
		"https://api.smartlist.tech/v2/lists/",
		{
			method: "POST",
			body: new URLSearchParams({
				token: global.session ? global.session.accessToken : undefined
			}),
			headers: { "Content-Type": "application/x-www-form-urlencoded" }
		}
	);

	return isLoading ? (
		<>
			{[1, 2, 3, 4, 5, 6].map((_, __) => (
				<Skeleton
					key={Math.random().toExponential()}
					variant="rectangular"
					height={100}
					animation="wave"
					sx={{ mb: 2, borderRadius: "28px" }}
				/>
			))}
		</>
	) : (
		<>
			{data.data.map((list: any) => (
				<List
					key={Math.random().toString()}
					title={list.title}
					description={list.description}
					id={list.id}
				/>
			))}
			<CreateListCard />
		</>
	);
}
