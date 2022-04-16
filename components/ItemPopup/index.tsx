import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tooltip from "@mui/material/Tooltip";
import { orange, blue } from "@mui/material/colors";
import { styled, alpha } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import ShareIcon from "@mui/icons-material/Share";
import ChatIcon from "@mui/icons-material/Chat";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import BoltIcon from "@mui/icons-material/Bolt";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, Form } from "formik";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";

const StyledMenu = styled((props: any) => (
	<Menu
		elevation={0}
		sx={{ mt: 1 }}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "right"
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "right"
		}}
		{...props}
	/>
))(({ theme }) => ({
	"& .MuiPaper-root": {
		borderRadius: "15px",
		minWidth: 180,
		color:
			theme.palette.mode === "light"
				? "rgb(55, 65, 81)"
				: theme.palette.grey[300],
		boxShadow:
			"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
		"& .MuiMenu-list": {
			padding: "4px"
		},
		"& .MuiMenuItem-root": {
			padding: "10px 15px",
			borderRadius: "15px",
			marginBottom: "1px",
			"& .MuiSvgIcon-root": {
				fontSize: 25,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.9)
			},
			"&:active": {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity
				)
			}
		}
	}
}));

function EditButton({
	title,
	setTitle,
	quantity,
	setQuantity,
	categories,
	setCategories
}: any) {
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
			<Dialog open={open} onClose={handleClose}>
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
										categories.trim() === "" ? [] : categories.split(",")
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
									sx={{ mt: 1, float: "right" }}
									color="primary"
									type="submit"
								>
									Save
								</Button>
							</Form>
						)}
					</Formik>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function InfoButton({ title, quantity, star }: any) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<MenuItem disableRipple onClick={handleClickOpen}>
				<InfoIcon />
				View details
			</MenuItem>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Item information"}</DialogTitle>
				<DialogContent sx={{ width: "450px", maxWidth: "100vw" }}>
					<DialogContentText id="alert-dialog-description">
						<Typography variant="body2">{"Title"}</Typography>
						<Typography>{title}</Typography>
						<br />
						<Typography variant="body2">{"Quantity"}</Typography>
						<Typography>{quantity}</Typography>
						<br />
						<Typography variant="body2">{"Starred"}</Typography>
						<Typography>{star === 1 ? "Starred" : "Not starred"}</Typography>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} autoFocus>
						Agree
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

function ItemActionsMenu({ title, quantity, star }: any) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Tooltip title="More">
				<IconButton
					size="large"
					edge="end"
					color="inherit"
					aria-label="menu"
					onClick={handleClick}
				>
					<MoreVertIcon />
				</IconButton>
			</Tooltip>
			<StyledMenu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button"
				}}
			>
				<InfoButton title={title} star={star} quantity={quantity} />
				<MenuItem disableRipple onClick={handleClose}>
					<ShareIcon /> Share
				</MenuItem>
				<MenuItem disableRipple onClick={handleClose}>
					<ChatIcon />
					WhatsApp
				</MenuItem>
				<MenuItem disableRipple onClick={handleClose}>
					<AutoAwesomeIcon />
					Find recipes
				</MenuItem>
				<MenuItem disableRipple onClick={handleClose}>
					<PersonAddIcon />
					Invite collaborators
				</MenuItem>
				<MenuItem disableRipple onClick={handleClose}>
					<ReceiptLongIcon />
					Add to list
				</MenuItem>
				<MenuItem disableRipple onClick={handleClose}>
					<BoltIcon />
					Move to
				</MenuItem>
				<MenuItem disableRipple onClick={handleClose}>
					<QrCodeScannerIcon />
					Generate QR code
				</MenuItem>
			</StyledMenu>
		</>
	);
}

function StarButton({ star, setStar }: any) {
	return (
		<Tooltip title={star === 0 ? "Star" : "Unstar"}>
			<IconButton
				size="large"
				edge="end"
				color="inherit"
				aria-label="menu"
				sx={{ mr: 1 }}
				onClick={() => setStar((s: any) => +!s)}
			>
				{star === 1 ? <StarIcon /> : <StarBorderIcon />}
			</IconButton>
		</Tooltip>
	);
}

function DeleteButton({ deleted, setDeleted, setDrawerState, setOpen }: any) {
	return (
		<Tooltip title="Move to trash">
			<IconButton
				size="large"
				edge="end"
				color="inherit"
				aria-label="menu"
				sx={{ mr: 1 }}
				onClick={() => {
					setOpen(true);
					setDeleted(true);
					setDrawerState(false);
				}}
			>
				<DeleteIcon />
			</IconButton>
		</Tooltip>
	);
}

export default function Item({ data, variant }: any) {
	const [itemData] = useState(data);
	const [title, setTitle] = useState(data.title);
	const [quantity, setQuantity] = useState(data.amount);
	const [star, setStar] = useState(itemData.star);
	const [deleted, setDeleted] = useState(false);
	const [categories, setCategories] = useState(data.categories);
	const [note, setNote] = useState(data.note);
	const [lastUpdated, setLastUpdated] = useState(data.lastUpdated);

	// onClick={() => setStar((s:any) => +!s)}
	const [drawerState, setDrawerState] = useState(false);

	useEffect(() => {
		document
			.querySelector(`meta[name="theme-color"]`)!
			.setAttribute("content", drawerState ? "#101010" : blue[800]);
	});
	const [open, setOpen] = React.useState(false);

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const action = (
		<React.Fragment>
			<Button
				onClick={(e) => {
					setDeleted(false);
					setDrawerState(true);
					handleClose(e);
				}}
			>
				UNDO
			</Button>
		</React.Fragment>
	);
	return (
		<>
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
				message="Item moved to trash"
				action={action}
			/>
			<SwipeableDrawer
				PaperProps={{
					sx: {
						borderRadius: 4,
						overflow: "hidden!important",
						mt: "5px",
						mr: "5px",
						height: "calc(100vh - 10px)!important"
					}
				}}
				swipeAreaWidth={0}
				anchor="right"
				open={drawerState}
				onClose={() => setDrawerState(false)}
				onOpen={() => setDrawerState(true)}
			>
				<Box
					sx={{
						flexGrow: 1,
						height: "100vh",
						position: "relative",
						width: {
							sm: "40vw",
							xs: "100vw"
						}
					}}
				>
					<AppBar
						position="absolute"
						sx={{ background: "#fff", py: 1, color: "#000" }}
						elevation={0}
					>
						<Toolbar>
							<Tooltip title="Back">
								<IconButton
									size="large"
									edge="start"
									color="inherit"
									aria-label="menu"
									sx={{ mr: 2 }}
									onClick={() => setDrawerState(false)}
								>
									<ChevronLeftIcon />
								</IconButton>
							</Tooltip>
							<Typography sx={{ flexGrow: 1 }}></Typography>
							<StarButton star={star} setStar={setStar} />
							<EditButton
								title={title}
								setTitle={setTitle}
								quantity={quantity}
								setQuantity={setQuantity}
								categories={categories}
								setCategories={setCategories}
							/>
							<DeleteButton
								deleted={deleted}
								setOpen={setOpen}
								setDrawerState={setDrawerState}
								setDeleted={setDeleted}
							/>
							<ItemActionsMenu star={star} title={title} quantity={quantity} />
						</Toolbar>
					</AppBar>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							flexDirection: "column",
							height: "100vh",
							px: 7,
							gap: 2
						}}
					>
						<Typography variant="h3">{title}</Typography>
						<Typography variant="h4">{quantity}</Typography>
						<Stack spacing={2} direction="row">
							{categories.split(",").map((category: string) => {
								if (category.trim() !== "") {
									return (
										<Chip key={Math.random().toString()} label={category} />
									);
								} else {
									return null;
								}
							})}
						</Stack>
						<TextField
							fullWidth
							multiline
							defaultValue={note}
							onChange={(e) => setNote(e.target.value)}
							maxRows={4}
							placeholder="Click to add note"
							inputProps={{ maxLength: 100 }}
							size="small"
						/>
					</Box>
				</Box>
			</SwipeableDrawer>

			<>
				{variant === "list" ? (
					<Collapse in={!deleted}>
						<ListItemButton
							onClick={() => setDrawerState(true)}
							sx={{ py: 0.1, borderRadius: "10px" }}
						>
							<ListItemText
								primary={title}
								secondary={dayjs(lastUpdated).fromNow()}
							/>
						</ListItemButton>
					</Collapse>
				) : (
					<>
						{deleted ? null : (
							<Card
								sx={{
									maxWidth: "100%",
									position: "relative",
									mb: 1,
									...(star === 1 && {
										background: orange[700],
										color: "white"
									})
								}}
								onClick={() => setDrawerState(true)}
							>
								<CardActionArea>
									<CardContent>
										<Typography
											variant="h6"
											sx={{ textOverflow: "ellipsis" }}
											noWrap
										>
											{title}
										</Typography>
										<Typography>{quantity}</Typography>
										<Stack spacing={2} direction="row" sx={{ mt: 1 }}>
											{categories.split(",").map((category: string) => {
												if (category.trim() === "") return false;
												return (
													<Chip
														key={Math.random().toString()}
														sx={{ pointerEvents: "none" }}
														label={category}
													/>
												);
											})}
										</Stack>
									</CardContent>
								</CardActionArea>
							</Card>
						)}
					</>
				)}
			</>
		</>
	);
}
