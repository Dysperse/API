import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, Form } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import dayjs from "dayjs";

export function CreateItemModal({
	toggleDrawer,
	room,
	children
}: {
	toggleDrawer: Function;
	room: string;
	children: any;
}) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const [loading, setLoading] = React.useState(false);
	function setClickLoading() {
		setLoading(true);
	}

	const initialValues = {
		categories: [],
		title: "",
		quantity: ""
	};
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const handleSnackbarClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}

		setSnackbarOpen(false);
	};
	const submit = async (values: {
		categories: Array<string>;
		title: string;
		quantity: string;
	}) => {
		const data = await fetch("https://api.smartlist.tech/v2/items/create/", {
			method: "POST",
			body: new URLSearchParams({
				token: ACCOUNT_DATA.accessToken,
				room: room.toLowerCase(),
				name: values.title,
				qty: values.quantity,
				category: JSON.stringify(values.categories),
				lastUpdated: dayjs().format("YYYY-M-D HH:mm:ss")
			})
		});
		setSnackbarOpen(true);
		setOpen(false);
	};
	return (
		<div>
			<div onClick={handleClickOpen}>{children}</div>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleSnackbarClose}
				message="Item created!"
			/>
			<SwipeableDrawer
				anchor="bottom"
				swipeAreaWidth={0}
				ModalProps={{
					keepMounted: true
				}}
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
				open={open}
				onClose={handleClose}
				onOpen={() => setOpen(true)}
			>
				<DialogTitle sx={{ mt: 2, textAlign: "center" }}>
					Create Item
				</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ mb: 1, textAlign: "center" }}>
						{room}
					</DialogContentText>
					<Formik initialValues={initialValues} onSubmit={submit}>
						{({ handleChange, values, setFieldValue }) => (
							<Form>
								<TextField
									// inputRef={(input) =>
									// 	setTimeout(() => input && input.focus(), 100)
									// }
									margin="dense"
									label="Title"
									fullWidth
									autoComplete={"off"}
									onChange={handleChange}
									disabled={loading}
									name="title"
									variant="filled"
								/>
								<TextField
									margin="dense"
									label="Quantity"
									autoComplete={"off"}
									fullWidth
									onChange={handleChange}
									disabled={loading}
									name="quantity"
									variant="filled"
								/>
								<Autocomplete
									id="categories"
									multiple
									freeSolo
									disabled={loading}
									options={[1, 2, 3]}
									onChange={(e, value) => {
										console.log(value);
										setFieldValue(
											"categories",
											value !== null ? value : initialValues.categories
										);
									}}
									renderInput={(params) => (
										<TextField
											margin="dense"
											sx={{ width: "100%" }}
											label="Categories"
											name="categories"
											variant="filled"
											{...params}
										/>
									)}
								/>
								<LoadingButton
									sx={{ mt: 1, float: "right" }}
									color="primary"
									type="submit"
									loading={loading}
									onClick={() => setTimeout(setClickLoading, 10)}
									variant="outlined"
								>
									Create
								</LoadingButton>
								<Button
									sx={{ mt: 1, mr: 1, float: "right" }}
									color="primary"
									type="button"
									onClick={() => {
										setLoading(false);
										setOpen(false);
									}}
								>
									Back
								</Button>
							</Form>
						)}
					</Formik>
				</DialogContent>
			</SwipeableDrawer>
		</div>
	);
}
