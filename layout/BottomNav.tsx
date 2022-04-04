import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import PaymentsIcon from "@mui/icons-material/Payments";
import SearchIcon from "@mui/icons-material/Search";

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
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Finances" icon={<PaymentsIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction label="Items" icon={<ViewAgendaIcon />} />
        <BottomNavigationAction label="Meals" icon={<LunchDiningIcon />} />
      </BottomNavigation>
    </Box>
  );
}
