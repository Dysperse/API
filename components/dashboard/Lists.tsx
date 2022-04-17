import * as React from "react";
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
import { List } from "./List";

function CreateListCard() {
	const [open, setOpen] = React.useState(false);

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
					background: "#eee"
				}}
			>
				<CardActionArea onClick={toggleDrawer(true)}>
					<CardContent>
						<AddCircleIcon sx={{ my: 1 }} />
						<Typography gutterBottom variant="h5" component="div">
							Create list
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
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
						autoComplete={"off"}
						name="title"
						variant="filled"
					/>
					<TextField
						margin="dense"
						label="Description"
						fullWidth
						autoComplete={"off"}
						name="title"
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

export function Lists() {
	const { isLoading, data }: any = useFetch(
		"https://api.smartlist.tech/v2/lists/",
		{
			method: "POST",
			body: new URLSearchParams({
				token: global.ACCOUNT_DATA.accessToken
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
