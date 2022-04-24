import React from "react";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { orange } from "@mui/material/colors";
export function StarButton({ id, star, setStar }: any) {
	return (
		<Tooltip title={star === 0 ? "Star" : "Unstar"}>
			<IconButton
				size="large"
				edge="end"
				color="inherit"
				aria-label="menu"
				sx={{
					mr: 1,
					...(star === 1 && {
						"&:hover": {
							background: global.theme === "dark" ? orange[900] : orange[50]
						}
					})
				}}
				onClick={() =>
					setStar((s: any) => {
						fetch("https://api.smartlist.tech/v2/items/star/", {
							method: "POST",
							body: new URLSearchParams({
								token: global.session && global.session.accessToken,
								id: id.toString(),
								date: dayjs().format("YYYY-M-D HH:mm:ss")
							})
						});
						return +!s;
					})
				}
			>
				{star === 1 ? (
					<span
						className="material-symbols-rounded"
						style={{
							color: global.theme === "dark" ? orange[200] : orange[600]
						}}
					>
						star_border
					</span>
				) : (
					<StarBorderIcon />
				)}
			</IconButton>
		</Tooltip>
	);
}
