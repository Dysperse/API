import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import PaymentsIcon from "@mui/icons-material/Payments";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";

const styles = {
  borderRadius: "15px",
  color: global.theme === "dark" ? "#ccc" : "#505050",
  px: "0!important",
  maxWidth: "20vw!important",
  minWidth: "20vw!important",
  width: "20vw!important",
  mr: "-1px",
  transition: "background .2s",
  "&:hover": {
    background:
      global.theme === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(200, 200, 200, .5)"
  },
  "&:active": {
    background:
      global.theme === "dark"
        ? "rgba(255,255,255,.3)"
        : "rgba(200, 200, 200, .8)"
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
    color: global.theme === "dark" ? "#fff" : "#303030",
    background: "transparent !important"
  }
};

export function BottomNav() {
  const router = useRouter();
  let v;
  switch (router.asPath) {
    case "/dashboard":
      v = 0;
      break;
    case "/finances":
      v = 1;
      break;
    case "/categories":
      v = 2;
      break;
    case "/meals":
      v = 3;
      break;
    default:
      v = 0;
  }
  const [value, setValue] = React.useState(v);

  const onLink = (href: any) => {
    router.push(href);
  };
  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        display: {
          xs: "block",
          sm: "none"
        }
      }}
    >
      <BottomNavigation
        value={value}
        sx={{
          py: 0.5,
          px: "3px",
          height: "auto",
          backdropFilter: "blur(15px)",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          background:
            global.theme === "dark"
              ? "rgba(255,255,255,.1)"
              : "rgba(220,220,220,.9)"
        }}
        showLabels
        onChange={(event, newValue) => {
          router.events.on("routeChangeComplete", () => {
            setValue(newValue);
          });
          router.events.off("routeChangeComplete", () => {
            setValue(newValue);
          });
        }}
      >
        <BottomNavigationAction
          sx={styles}
          label="Home"
          disableRipple
          onClick={() => onLink("/dashboard")}
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          sx={styles}
          label="Finances"
          disableRipple
          onClick={() => onLink("/finances")}
          icon={<PaymentsIcon />}
        />
        <BottomNavigationAction
          sx={styles}
          label="Search"
          disableRipple
          onClick={() => onLink("/finances")}
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          sx={styles}
          label="Items"
          disableRipple
          onClick={() => onLink("/categories")}
          icon={<ViewAgendaIcon />}
        />
        <BottomNavigationAction
          sx={styles}
          label="Meals"
          disableRipple
          onClick={() => onLink("/meals")}
          icon={<LunchDiningIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
