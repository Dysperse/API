import Avatar from "@mui/material/Avatar";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import React, { useEffect } from "react";
import Settings from "../Settings/index";

export function ProfileMenu(props: any) {
  const { window } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  useEffect(() => {
    document.documentElement.classList[open ? "add" : "remove"](
      "prevent-scroll"
    );
    document.querySelector(`meta[name="theme-color"]`) &&
      document
        .querySelector(`meta[name="theme-color"]`)!
        .setAttribute(
          "content",
          open
            ? global.theme === "dark"
              ? "hsl(240, 11%, 10%)"
              : "#cccccc"
            : global.theme === "dark"
            ? "hsl(240, 11%, 10%)"
            : "#fff"
        );
  }, [open]);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <IconButton
      disableRipple
      onClick={toggleDrawer(true)}
      color="inherit"
      aria-label="open drawer."
      edge="end"
      sx={{
        ml: -0.3,
        transform: "scale(.7)",
        transition: "none",
        color: "#404040",
        "&:hover": { color: "#000" },
      }}
    >
      <Settings>
        <Avatar
          sx={{
            fontSize: "15px",
            bgcolor: colors[themeColor][200],
            borderRadius: 4.5,
            transform: "scale(1.2)",
          }}
          alt="Profie picture"
          src={global.session.user.image}
        />
      </Settings>
    </IconButton>
  );
}
