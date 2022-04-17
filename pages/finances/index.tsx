import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NoData from "../../components/finances/NoData";

export default function Finances() {
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h5">Finances</Typography>
			<NoData />
		</Box>
	);
}
