import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Skeleton from "@mui/material/Skeleton";
import { blue } from "@mui/material/colors";
import AddPopup from "./AddPopup";

export function FloatingActionButton() {
	return (
		<Box
			sx={{
				position: "fixed",
				bottom: {
					lg: "15px",
					sm: "70px",
					md: "15px",
					xs: "70px"
				},
				right: "12px"
			}}
		>
			<AddPopup>
				{global.session ? (
					<Fab
						variant="extended"
						color="primary"
						aria-label="add"
						sx={{
							borderRadius: "20px",
							textTransform: "none",
							px: 3,
							boxShadow: 0,
							fontSize: "15px",
							background: global.theme === "dark" ? blue[900] : blue[200],
							color: global.theme === "dark" ? blue[100] : blue[900],
							"&:hover": {
								background: global.theme === "dark" ? blue[800] : blue[300]
							},
							py: 2,
							height: "auto",
							maxHeight: "auto"
						}}
					>
						<span
							className="material-symbols-rounded"
							style={{ marginRight: "15px" }}
						>
							add
						</span>
						Create
					</Fab>
				) : (
					<Skeleton
						sx={{ borderRadius: 5, mr: 1, background: "#bbb" }}
						variant="rectangular"
						width={140}
						height={60}
						animation="wave"
					/>
				)}
			</AddPopup>
		</Box>
	);
}
