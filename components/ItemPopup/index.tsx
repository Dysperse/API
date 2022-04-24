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
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import Snackbar from "@mui/material/Snackbar";
import { blueGrey } from "@mui/material/colors";
import useWindowDimensions from "../../components/useWindowDimensions";
import { StarButton } from "./StarButton";
import { EditButton } from "./EditButton";
import { ItemActionsMenu } from "./ItemActionsMenu";
import { DeleteButton } from "./DeleteButton";

export default function Item({ data, variant }: any) {
	const [itemData] = useState(data);
	const id = data.id;
	const [title, setTitle] = useState(data.title);
	const [quantity, setQuantity] = useState(data.amount);
	const [star, setStar] = useState(itemData.star);
	const [deleted, setDeleted] = useState(false);
	const [categories, setCategories] = useState(data.categories);
	const [note, setNote] = useState(data.note);
	const [lastUpdated, setLastUpdated] = useState(data.lastUpdated);
	const [drawerState, setDrawerState] = useState(false);

	const { width }: any = useWindowDimensions();

	useEffect(() => {
		document.documentElement.classList[drawerState ? "add" : "remove"](
			"prevent-scroll"
		);
		document
			.querySelector(`meta[name="theme-color"]`)!
			.setAttribute(
				"content",
				drawerState
					? width > 900
						? "#808080"
						: "#eee"
					: document.documentElement!.scrollTop === 0
					? "#fff"
					: blue[100]
			);
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
				sx={{
					backdropFilter: "blur(10px)",
					opacity: "1!important"
				}}
				PaperProps={{
					sx: {
						borderRadius: { sm: 4 },
						overflow: "hidden!important",
						mt: { sm: "7px" },
						mr: { sm: "7px" },
						height: { sm: "calc(100vh - 14px)!important" }
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
							<StarButton id={id} star={star} setStar={setStar} />
							<EditButton
								id={id}
								title={title}
								setTitle={setTitle}
								quantity={quantity}
								setQuantity={setQuantity}
								categories={categories}
								setCategories={setCategories}
								setLastUpdated={setLastUpdated}
							/>
							<DeleteButton
								id={id}
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
							multiline
							fullWidth
							onBlur={(e) => {
								// alert(1);
								setLastUpdated(dayjs().format("YYYY-M-D HH:mm:ss"));
								setNote(e.target.value);
								fetch("https://api.smartlist.tech/v2/items/update-note/", {
									method: "POST",
									body: new URLSearchParams({
										token: global.session
											? global.session.accessToken
											: undefined,
										id: id.toString(),
										date: dayjs().format("YYYY-M-D HH:mm:ss"),
										content: e.target.value
									})
								});
							}}
							onKeyUp={(e: any) => {
								if (e.code === "Enter" && !e.shiftKey) {
									e.preventDefault();
									e.target.value = e.target.value.trim();
									e.target.blur();
								}
							}}
							InputProps={{
								sx: {
									px: 2.5,
									py: 1.5,
									borderRadius: "15px"
								}
							}}
							defaultValue={note}
							maxRows={4}
							placeholder="Click to add note"
						/>
					</Box>
				</Box>
			</SwipeableDrawer>

			<>
				{variant === "list" ? (
					<Collapse in={!deleted}>
						<ListItemButton
							onClick={() => setDrawerState(true)}
							sx={{ py: 0.1, borderRadius: "10px", transition: "all .03s" }}
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
									boxShadow: 0,
									borderRadius: "28px",
									background: blueGrey[50],
									transition: "all .03s",
									...(star === 1 && {
										background: orange[700],
										color: "white"
									})
								}}
								onClick={() => setDrawerState(true)}
							>
								<CardActionArea>
									<CardContent sx={{ p: 3 }}>
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
