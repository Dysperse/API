import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import ChatIcon from "@mui/icons-material/Chat";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BoltIcon from "@mui/icons-material/Bolt";
import MenuItem from "@mui/material/MenuItem";
import { AddToListModal } from "./AddToList";
import { InfoButton } from "./InfoButton";
import { QrCodeModal } from "./QrCodeModal";
import { blue } from "@mui/material/colors";
import Menu from "@mui/material/Menu";

export function ItemActionsMenu({ title, quantity, star }: any): JSX.Element {
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
					<span className="material-symbols-rounded">more_vert</span>
				</IconButton>
			</Tooltip>
			<Menu
				BackdropProps={{ sx: { opacity: "0!important" } }}
				elevation={0}
				id="basic-menu"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center"
				}}
				transitionDuration={300}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				sx={{
					transition: "all .2s",
					// "& *": {
					// },
					"& .MuiPaper-root": {
						borderRadius: "15px",
						minWidth: 180,
						background: global.theme === "dark" ? blue[900] : blue[100],

						color: global.theme === "dark" ? blue[200] : blue[800],
						"& .MuiMenu-list": {
							padding: "4px"
						},
						"& .MuiMenuItem-root": {
							"&:hover": {
								background: global.theme === "dark" ? blue[800] : blue[200],
								color: global.theme === "dark" ? blue[100] : blue[900],
								"& .MuiSvgIcon-root": {
									color: global.theme === "dark" ? blue[200] : blue[800]
								}
							},
							padding: "10px 15px",
							borderRadius: "15px",
							marginBottom: "1px",
							transition: "all .05s",

							"& .MuiSvgIcon-root": {
								fontSize: 25,
								color: blue[700],
								marginRight: 1.9
							},
							"&:active": {
								background: global.theme === "dark" ? blue[700] : blue[300]
							}
						}
					}
				}}
				MenuListProps={{
					"aria-labelledby": "basic-button"
				}}
			>
				<InfoButton title={title} star={star} quantity={quantity} />
				<MenuItem disableRipple onClick={handleClose}>
					<span
						style={{ marginRight: "10px" }}
						className="material-symbols-rounded"
					>
						share
					</span>
					Share
				</MenuItem>
				<MenuItem disableRipple onClick={handleClose}>
					<span
						style={{ marginRight: "10px" }}
						className="material-symbols-rounded"
					>
						chat
					</span>
					WhatsApp
				</MenuItem>
				<MenuItem disableRipple onClick={handleClose}>
					<span
						style={{ marginRight: "10px" }}
						className="material-symbols-rounded"
					>
						auto_awesome
					</span>
					Find recipes
				</MenuItem>
				<MenuItem disableRipple onClick={handleClose}>
					<span
						style={{ marginRight: "10px" }}
						className="material-symbols-rounded"
					>
						person_add
					</span>
					Invite collaborators
				</MenuItem>
				<AddToListModal handleClose={handleClose} />
				<QrCodeModal title={title} quantity={quantity} />
			</Menu>
		</>
	);
}
