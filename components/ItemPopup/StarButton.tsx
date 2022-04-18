import React from "react";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export function StarButton({ id, star, setStar }: any) {
	return (
		<Tooltip title={star === 0 ? "Star" : "Unstar"}>
			<IconButton
				size="large"
				edge="end"
				color="inherit"
				aria-label="menu"
				sx={{ mr: 1 }}
				onClick={() =>
					setStar((s: any) => {
						fetch("https://api.smartlist.tech/v2/items/star/", {
							method: "POST",
							body: new URLSearchParams({
								token: ACCOUNT_DATA.accessToken,
								id: id.toString(),
								date: dayjs().format("YYYY-M-D HH:mm:ss")
							})
						});
						return +!s;
					})
				}
			>
				{star === 1 ? <StarIcon /> : <StarBorderIcon />}
			</IconButton>
		</Tooltip>
	);
}
