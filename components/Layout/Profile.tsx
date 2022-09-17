import React, { useEffect } from "react";
import Settings from "../Settings/index";
import Box from "@mui/material/Box";

/**
 * Profile menu
 * @param {any} props
 * @returns {any}
 */
export function ProfileMenu(props: any) {
  const [open, setOpen] = React.useState<boolean>(false);
  useEffect(() => {
    document.querySelector(`meta[name="theme-color"]`) &&
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute(
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

  return (
    <Settings>
      <Box onClick={() => setOpen(true)}>{props.children}</Box>
    </Settings>
  );
}
