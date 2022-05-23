import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import { useRouter } from "next/router";
import * as React from "react";
import { SearchPopup } from "./SearchPopup";

const styles = {
  borderRadius: "15px",
  color: global.theme === "dark" ? "#ccc" : "#505050",
  px: "0!important",
  maxHeight: { sm: "70px" },
  maxWidth: { xs: "20vw!important", sm: "65px!important" },
  minWidth: { xs: "20vw!important", sm: "65px!important" },
  width: { xs: "20vw!important", sm: "65px!important" },
  mr: "-1px",
  transition: "none",
  "&:hover": {
    background:
      global.theme === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(200, 200, 200, .5)",
  },
  "&:active": {
    background:
      global.theme === "dark"
        ? "rgba(255,255,255,.3)"
        : "rgba(200, 200, 200, .9)",
  },
  "&.Mui-selected svg": {
    background: "rgba(150, 150, 150, .7)",
  },
  "& span:not(.MuiIcon-root)": {
    fontSize: "13px!important",
  },
  "& .MuiIcon-root": {
    fontSize: "21px",
    mb: 0.3,
    borderRadius: 9,
    textAlign: "center",
    width: "70%",
    maxWidth: "50px",
    py: 0.3,
    height: "auto",
    overflow: "visible",
  },
  "&.Mui-selected .MuiIcon-root": {
    background: "rgba(0,0,0,0.3)",
  },
  "&.Mui-selected": {
    color: global.theme === "dark" ? "#fff" : "#000",
    background: "transparent !important",
  },
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
    case "/trash":
    case "/categories":
      v = 3;
      break;
    case "/planner":
      v = 4;
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
        width: { xs: "100%", sm: "65px" },
        position: "fixed",
        bottom: { xs: 0, md: "unset" },
        top: { xs: "unset", md: 0 },
        left: 0,
        display: {
          xs: "block",
          md: "none",
        },
      }}
    >
      <SearchPopup
        content={
          <button id="searchTrigger" style={{ display: "none" }}></button>
        }
      />
      <BottomNavigation
        value={value}
        sx={{
          py: 0.5,
          px: { xs: "3px", sm: "0px" },
          height: { xs: "auto", sm: "100vh" },
          alignItems: "center",
          flexDirection: { sm: "column" },
          backdropFilter: "blur(15px)",
          borderTopLeftRadius: { xs: "15px", sm: "0" },
          borderTopRightRadius: { xs: "15px", sm: "15px" },
          borderBottomRightRadius: { sm: "15px" },

          background:
            global.theme === "dark"
              ? "rgba(255,255,255,.1)"
              : "rgba(210,210,210,.9)",
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
          icon={<Icon baseClassName="material-symbols-rounded">dashboard</Icon>}
        />
        <BottomNavigationAction
          sx={styles}
          label="Finances"
          disableRipple
          onClick={() => onLink("/finances")}
          icon={<Icon baseClassName="material-symbols-rounded">savings</Icon>}
        />

        <BottomNavigationAction
          sx={styles}
          label="Search"
          disableRipple
          onClick={() => document.getElementById("searchTrigger")!.click()}
          icon={
            <Icon baseClassName="material-symbols-rounded">electric_bolt</Icon>
          }
        />
        <BottomNavigationAction
          sx={styles}
          label="Items"
          disableRipple
          onClick={() => onLink("/categories")}
          icon={<Icon baseClassName="material-symbols-rounded">category</Icon>}
        />
        <BottomNavigationAction
          sx={styles}
          label="Planner"
          disableRipple
          onClick={() => onLink("/planner")}
          icon={<Icon baseClassName="material-symbols-rounded">event</Icon>}
        />
      </BottomNavigation>
    </Box>
  );
}
