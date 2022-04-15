import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { blue } from "@mui/material/colors";
import AddPopup from "./AddPopup";

import AddIcon from "@mui/icons-material/Add";

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
				right: "15px"
			}}
		>
			<AddPopup>
				<Fab
					variant="extended"
					color="primary"
					aria-label="add"
					sx={{
						borderRadius: "20px",
						textTransform: "none",
						px: 4,
						boxShadow: 0,
						fontSize: "15px",
						background: blue[200],
						color: blue[900],
						"&:hover": {
							background: blue[300]
						},
						py: 2,
						height: "auto",
						maxHeight: "auto"
					}}
				>
					<AddIcon sx={{ mr: 2 }} />
					Create
				</Fab>
			</AddPopup>
		</Box>
	);
}
