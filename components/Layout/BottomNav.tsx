import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import { useRouter } from "next/router";
import * as React from "react";
import hexToRgba from "hex-to-rgba";
import * as colors from "@mui/material/colors";

const styles = {
  borderRadius: "15px",
  px: "0!important",
  transition: "transform .2s",
  "&:active": {
    transform: "scale(.94)",
    transition: "none",
  },
  "& *": {
    maxWidth: "70%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  maxHeight: { sm: "70px" },
  maxWidth: { xs: "25vw!important", sm: "65px!important" },
  minWidth: { xs: "25vw!important", sm: "65px!important" },
  width: { xs: "20vw!important", sm: "65px!important" },
  mr: "-1px",
  "&.Mui-selected svg": {
    background: "rgba(150, 150, 150, .7)",
  },
  "& span:not(.MuiIcon-root)": {
    fontSize: "13px!important",
  },
  "& .MuiIcon-root": {
    fontSize: "23px",
    mb: 0.3,
    borderRadius: 3,
    textAlign: "center",
    width: "70%",
    maxWidth: "50px",
    py: 0.3,
    height: "auto",
    overflow: "visible",
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
      v = 3;
      break;
    case "/trash":
    case "/items":
      v = 1;
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
              : hexToRgba(colors[themeColor][100], 0.9),
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
            "&:not(.Mui-selected)": {
              color:
                (global.theme === "dark" ? "#ccc" : colors[themeColor]["600"]) +
                "!important",
            },
            "&.Mui-selected": {
              color:
                global.theme === "dark" ? "#ccc" : colors[themeColor]["900"],
              fontWeight: "700",
              background: "transparent !important",
            },
            "&.Mui-selected .MuiIcon-root": {
              background: colors[themeColor][200],
            },
          }}
          label="Home"
          disableRipple
          onClick={() => onLink("/dashboard")}
          icon={<Icon baseClassName="material-symbols-rounded">layers</Icon>}
        />
        <BottomNavigationAction
          sx={{
            ...styles,
            "&:not(.Mui-selected)": {
              color:
                (global.theme === "dark" ? "#ccc" : colors[themeColor]["600"]) +
                "!important",
            },
            "&.Mui-selected": {
              color:
                global.theme === "dark" ? "#ccc" : colors[themeColor]["900"],
              fontWeight: "700",
              background: "transparent !important",
            },
            "&.Mui-selected .MuiIcon-root": {
              background: colors[themeColor][200],
            },
          }}
          label="Items"
          disableRipple
          onClick={() => onLink("/items")}
          icon={<Icon baseClassName="material-symbols-rounded">category</Icon>}
        />
        <BottomNavigationAction
          sx={{
            ...styles,
            "&:not(.Mui-selected)": {
              color:
                (global.theme === "dark" ? "#ccc" : colors[themeColor]["600"]) +
                "!important",
            },
            "&.Mui-selected": {
              color:
                global.theme === "dark" ? "#ccc" : colors[themeColor]["900"],
              fontWeight: "700",
              background: "transparent !important",
            },
            "&.Mui-selected .MuiIcon-root": {
              background: colors[themeColor][200],
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
            "&:not(.Mui-selected)": {
              color:
                (global.theme === "dark" ? "#ccc" : colors[themeColor]["600"]) +
                "!important",
            },
            "&.Mui-selected": {
              color:
                global.theme === "dark" ? "#ccc" : colors[themeColor]["900"],
              fontWeight: "700",
              background: "transparent !important",
            },
            "&.Mui-selected .MuiIcon-root": {
              background: colors[themeColor][200],
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
              Sustainability
            </span>
          }
          disableRipple
          onClick={() => onLink("/save-the-planet")}
          icon={<Icon baseClassName="material-symbols-rounded">eco</Icon>}
        />
      </BottomNavigation>
    </Box>
  );
}
