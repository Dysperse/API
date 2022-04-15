import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import PaymentsIcon from "@mui/icons-material/Payments";
import SearchIcon from "@mui/icons-material/Search";

const styles = {
	borderRadius: "15px",
	color: "#505050",
	mr: "1px",
	transition: "background .2s",
	"&:hover": {
		background: "rgba(200, 200, 200, .5)"
	},
	"&:active": {
		background: "rgba(200, 200, 200, .8)"
	},
	"& span": { fontSize: "13px!important" },
	"& svg": {
		background: "transparent",
		width: "50px",
		height: "25px",
		py: "2px",
		transition: "background .2s",
		borderRadius: "25px"
	},
	"&.Mui-selected svg": {
		background: "rgba(150, 150, 150, .7)"
	},
	"&.Mui-selected": {
		color: "#303030",
		background: "transparent !important"
	}
};

export function BottomNav() {
	const [value, setValue] = React.useState(0);

	return (
		<Box
			sx={{
				width: "100%",
				position: "fixed",
				bottom: 0,
				left: 0,
				display: {
					lg: "none",
					xl: "none",
					md: "block",
					sm: "block"
				}
			}}
		>
			<BottomNavigation
				value={value}
				sx={{
					py: 0.5,
					px: "3px",
					height: "auto",
					backdropFilter: "blur(10px)",
					borderTopLeftRadius: "15px",
					borderTopRightRadius: "15px",
					background: "rgba(200,200,200,.3)"
				}}
				showLabels
				onChange={(event, newValue) => {
					setValue(newValue);
				}}
			>
				<BottomNavigationAction
					sx={styles}
					label="Home"
					disableRipple
					icon={<HomeIcon />}
				/>
				<BottomNavigationAction
					sx={styles}
					label="Finances"
					disableRipple
					icon={<PaymentsIcon />}
				/>
				<BottomNavigationAction
					sx={styles}
					label="Search"
					disableRipple
					icon={<SearchIcon />}
				/>
				<BottomNavigationAction
					sx={styles}
					label="Items"
					disableRipple
					icon={<ViewAgendaIcon />}
				/>
				<BottomNavigationAction
					sx={styles}
					label="Meals"
					disableRipple
					icon={<LunchDiningIcon />}
				/>
			</BottomNavigation>
		</Box>
	);
}
