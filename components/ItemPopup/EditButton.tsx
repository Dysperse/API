import React from "react";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, Form } from "formik";
import { isJsonString } from "./isJsonString";

export function EditButton({
	id,
	title,
	setTitle,
	quantity,
	setQuantity,
	categories,
	setCategories,
	setLastUpdated
}: any): JSX.Element {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const initialValues = {
		categories: [],
		title: title,
		quantity: quantity
	};

	const submit = (values: any) => {
		fetch("https://api.smartlist.tech/v2/items/edit/", {
			method: "POST",
			body: new URLSearchParams({
				token: ACCOUNT_DATA.accessToken,
				id: id.toString(),
				lastUpdated: dayjs().format("YYYY-M-D HH:mm:ss"),
				name: values.title,
				qty: values.quantity,
				category: values.categories
			})
		});

		setLastUpdated(dayjs().format("YYYY-M-D HH:mm:ss"));
		setTitle(values.title);
		setQuantity(values.quantity);
		setCategories(values.categories.join(","));
		handleClose();
	};

	return (
		<div>
			<Tooltip title="Edit">
				<IconButton
					size="large"
					edge="end"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 1 }}
					onClick={handleClickOpen}
				>
					<EditIcon />
				</IconButton>
			</Tooltip>
			<Dialog
				open={open}
				onClose={handleClose}
				sx={{
					transition: "all .2s",
					backdropFilter: "blur(10px)"
				}}
				PaperProps={{
					sx: {
						borderRadius: "28px"
					}
				}}
			>
				<DialogTitle>Edit item</DialogTitle>
				<DialogContent>
					<Formik initialValues={initialValues} onSubmit={submit}>
						{({ handleChange, values, setFieldValue }) => (
							<Form>
								<TextField
									margin="dense"
									autoFocus
									label="Title"
									fullWidth
									onChange={handleChange}
									defaultValue={title}
									name="title"
									variant="filled"
								/>
								<TextField
									margin="dense"
									label="Quantity"
									fullWidth
									onChange={handleChange}
									defaultValue={quantity}
									name="quantity"
									variant="filled"
								/>
								<Autocomplete
									id="categories"
									multiple
									freeSolo
									options={[1, 2, 3]}
									defaultValue={
										categories.trim() === ""
											? []
											: isJsonString(categories)
											? JSON.parse(categories)
											: categories.split(",")
									}
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
											label="Categories"
											name="categories"
											variant="filled"
											{...params}
										/>
									)}
								/>
								<Button
									variant="contained"
									disableElevation
									size="large"
									type="submit"
									sx={{
										borderRadius: 99,
										float: "right",
										textTransform: "none",
										px: 3,
										py: 1,
										mt: 1
									}}
								>
									Cancel
								</Button>
							</Form>
						)}
					</Formik>
				</DialogContent>
			</Dialog>
		</div>
	);
}
