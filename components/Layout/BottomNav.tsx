import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import { useRouter } from "next/router";
import * as React from "react";

const styles = {
  borderRadius: "15px",
  px: "0!important",
  "& *": {
    maxWidth: "70%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  maxHeight: { sm: "70px" },
  maxWidth: { xs: "20vw!important", sm: "65px!important" },
  minWidth: { xs: "20vw!important", sm: "65px!important" },
  width: { xs: "20vw!important", sm: "65px!important" },
  mr: "-1px",
  transition: "none",
  "&:hover": {
    background:
      global.theme === "dark"
        ? "rgba(255,255,255,0.15)"
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
  py: 0.5,
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
    case "/save-the-planet":
      v = 2;
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
      <BottomNavigation
        value={value}
        sx={{
          py: 0.5,
          px: { xs: "3px", sm: "0px" },
          height: { xs: "auto", sm: "100vh" },
          alignItems: "center",
          flexDirection: { sm: "column" },
          backdropFilter: "blur(15px)",
          borderTopLeftRadius: { xs: "0px", sm: "0" },
          borderTopRightRadius: { xs: "0px", sm: "15px" },
          borderBottomRightRadius: { sm: "15px" },

          background:
            global.theme === "dark"
              ? "rgba(68, 68, 85,.9)"
              : "rgba(210,210,210,.8)",
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
          sx={{
            ...styles,
            color: global.theme === "dark" ? "#ccc" : "#505050",
            "&.Mui-selected": {
              color: global.theme === "dark" ? "#fff" : "#000",
              background: "transparent !important",
            },
          }}
          label="Home"
          disableRipple
          onClick={() => onLink("/dashboard")}
          icon={<Icon baseClassName="material-symbols-rounded">dashboard</Icon>}
        />
        <BottomNavigationAction
          sx={{
            ...styles,
            "&.Mui-selected": {
              color: global.theme === "dark" ? "#fff" : "#000",
              background: "transparent !important",
            },
          }}
          label="Finances"
          disableRipple
          onClick={() => onLink("/finances")}
          icon={<Icon baseClassName="material-symbols-rounded">savings</Icon>}
        />

        <BottomNavigationAction
          sx={{
            ...styles,
            "&.Mui-selected": {
              color: global.theme === "dark" ? "#fff" : "#000",
              background: "transparent !important",
            },
          }}
          label={
            <span
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              Eco friendlinessssssss
            </span>
          }
          disableRipple
          onClick={() => onLink("/save-the-planet")}
          icon={
            <Icon baseClassName="material-symbols-rounded">
              energy_savings_leaf
            </Icon>
          }
        />
        <BottomNavigationAction
          sx={{
            ...styles,
            "&.Mui-selected": {
              color: global.theme === "dark" ? "#fff" : "#000",
              background: "transparent !important",
            },
          }}
          label="Items"
          disableRipple
          onClick={() => onLink("/categories")}
          icon={<Icon baseClassName="material-symbols-rounded">category</Icon>}
        />
        <BottomNavigationAction
          sx={{
            ...styles,
            "&.Mui-selected": {
              color: global.theme === "dark" ? "#fff" : "#000",
              background: "transparent !important",
            },
          }}
          label="Planner"
          disableRipple
          onClick={() => onLink("/planner")}
          icon={<Icon baseClassName="material-symbols-rounded">event</Icon>}
        />
      </BottomNavigation>
    </Box>
  );
}
