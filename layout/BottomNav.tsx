import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { NextLinkComposed } from "next/link";

import dynamic from "next/dynamic";
const HomeIcon = dynamic(() => import("@mui/icons-material/Home"));
const ViewAgendaIcon = dynamic(() => import("@mui/icons-material/ViewAgenda"));
const LunchDiningIcon = dynamic(() =>
  import("@mui/icons-material/LunchDining")
);
const PaymentsIcon = dynamic(() => import("@mui/icons-material/Payments"));
const SearchIcon = dynamic(() => import("@mui/icons-material/Search"));

export function BottomNav() {
  const [value, setValue] = React.useState(0);

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        backgroundColor: "red",
        display: {
          lg: "none",
          xl: "none",
          md: "block",
          sm: "block"
        },
        boxShadow: 10
      }}
    >
      <BottomNavigation
        value={value}
        showLabels
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          component={NextLinkComposed}
          to={{
            pathname: "/dashboard"
          }}
          label="Home"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          component={NextLinkComposed}
          to={{
            pathname: "/finances"
          }}
          label="Finances"
          icon={<PaymentsIcon />}
        />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction label="Items" icon={<ViewAgendaIcon />} />
        <BottomNavigationAction label="Meals" icon={<LunchDiningIcon />} />
      </BottomNavigation>
    </Box>
  );
}
