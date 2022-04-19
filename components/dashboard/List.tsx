import React, { useState, useEffect } from "react";
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
import { blueGrey, blue } from "@mui/material/colors";
import { Formik, Form } from "formik";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

function CreateItemButton({ parent }: { parent: number }) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const initialValues = {
		name: "",
		descripton: ""
	};

	const submit = async (values: { name: string; descripton: string }) => {
		alert(JSON.stringify(values, null, 2));
		fetch("https://api.smartlist.tech/v2/lists/create-item/", {
			method: "POST",
			body: new URLSearchParams({
				token: ACCOUNT_DATA.accessToken,
				parent: parent.toString(),
				title: values.name,
				description: values.description
			})
		});
	};
	const stopPropagationForTab = (event: any) => {
		if (event.key !== "Esc") {
			event.stopPropagation();
		}
	};
	return (
		<>
			<Button
				onClick={handleClickOpen}
				size="large"
				disableElevation
				sx={{ textTransform: "none", mr: 1, mb: 3, borderRadius: 100 }}
				variant="contained"
			>
				Create item
			</Button>
			<SwipeableDrawer
				anchor="bottom"
				onKeyDown={stopPropagationForTab}
				swipeAreaWidth={0}
				disableSwipeToOpen={true}
				ModalProps={{
					keepMounted: true
				}}
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
				open={open}
				onClose={handleClose}
				onOpen={() => setOpen(true)}
			>
				<Formik initialValues={initialValues} onSubmit={submit}>
					{({ handleChange, values, setFieldValue }) => (
						<Form>
							<DialogTitle sx={{ textAlign: "center" }} id="alert-dialog-title">
								<Typography
									gutterBottom
									variant="h5"
									component="div"
									sx={{ mt: 4, mb: 2 }}
								>
									Create item
								</Typography>
							</DialogTitle>
							<DialogContent>
								<DialogContentText id="alert-dialog-description">
									<TextField
										autoFocus
										id="name"
										fullWidth
										autoComplete="off"
										margin="dense"
										label="Item name"
										variant="filled"
										onChange={handleChange}
										name="name"
									/>
									<TextField
										onChange={handleChange}
										name="description"
										autoComplete="off"
										margin="dense"
										id="description"
										fullWidth
										label="Description"
										multiline
										variant="filled"
									/>
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									type="reset"
									size="large"
									disableElevation
									sx={{
										textTransform: "none",
										borderRadius: 100
									}}
									variant="outlined"
								>
									Cancel
								</Button>
								<Button
									onClick={handleClose}
									type="submit"
									size="large"
									disableElevation
									sx={{
										textTransform: "none",
										mr: 1,
										borderRadius: 100
									}}
									variant="contained"
								>
									Create
								</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</SwipeableDrawer>
		</>
	);
}

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
							fetch("https://api.smartlist.tech/v2/lists/delete-item/", {
								method: "POST",
								body: new URLSearchParams({
									token: ACCOUNT_DATA.accessToken,
									id: item.id
								})
							});
						}}
					/>
				}
				label={item.title}
				sx={{ m: 0, display: "block" }}
			/>
		</Collapse>
	);
}

function ListPopup({
	setDeleted,
	listItems,
	title,
	id,
	drawerState,
	setDrawerState
}: any) {
	useEffect(() => {
		document.documentElement.classList[drawerState ? "add" : "remove"](
			"prevent-scroll"
		);
		document
			.querySelector(`meta[name="theme-color"]`)!
			.setAttribute("content", drawerState ? "#808080" : blue[50]);
	});
	return (
		<SwipeableDrawer
			anchor="bottom"
			sx={{
				backdropFilter: "blur(10px)"
			}}
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
			onOpen={() => setDrawerState(true)}
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
				<CreateItemButton parent={id} />
				<Button
					size="large"
					sx={{ textTransform: "none", mr: 1, mb: 3, borderRadius: 100 }}
					variant="outlined"
					onClick={() => {
						setDrawerState(false);
					}}
				>
					Share
				</Button>
				<Button
					size="large"
					sx={{ textTransform: "none", mb: 3, borderRadius: 100 }}
					variant="outlined"
					onClick={() => {
						setDrawerState(false);
						setDeleted(true);
					}}
				>
					Delete
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
							<Box sx={{ textAlign: "center", opacity: ".5", py: 6 }}>
								<Typography variant="h3" sx={{ mb: 2 }}>
									¯\_(ツ)_/¯
								</Typography>
								<Typography variant="h5">No items yet...</Typography>
							</Box>
						) : null}
						{listItems.data.data.map((item: any) => (
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

	const [deleted, setDeleted] = useState(false);
	return (
		<>
			<ListPopup
				title={title}
				id={id}
				listItems={listItems}
				drawerState={drawerState}
				setDrawerState={setDrawerState}
				setDeleted={setDeleted}
			/>
			{!deleted ? (
				<Card
					sx={{
						mb: 2,
						width: "100%",
						borderRadius: "28px",
						background: blueGrey[50],
						boxShadow: 0
					}}
				>
					<CardActionArea
						sx={{ p: 1 }}
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
			) : null}
		</>
	);
}
