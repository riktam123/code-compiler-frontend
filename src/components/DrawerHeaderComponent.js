import * as React from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
	justifyContent: "flex-end",
}));

export default function DrawerHeaderComponent({ handleDrawerClose }) {
	const theme = useTheme();

	return (
		<DrawerHeader>
			<IconButton onClick={handleDrawerClose}>
				{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
			</IconButton>
		</DrawerHeader>
	);
}
