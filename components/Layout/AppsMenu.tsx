import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";
import { neutralizeBack, revivalBack } from "../history-control";
import { green } from "@mui/material/colors";

function Products() {
  const apps = [
    {
      key: 1,
      href: "//my.smartlist.tech",
      label: "Carbon",
      description: "Home inventory",
    },
    {
      key: 3,
      label: "Availability",
      href: "//availability.smartlist.tech",
      description: "Find the best time for a group to get together",
    },
    {
      key: 4,
      label: "Dressing",
      href: "//dressing.smartlist.tech",

      description: "Match dress sizes which fit you in multiple stores",
    },
    {
      key: 5,
      bg: green[global.theme === "dark" ? 900 : 200],
      href: "https://feedback.smartlist.tech/",
      target: "_blank",
      label: (
        <>
          <span
            className="material-symbols-outlined"
            style={{ marginRight: "10px" }}
          >
            lightbulb
          </span>
          Suggest an app
        </>
      ),
      description: (
        <div style={{ color: green[global.theme === "dark" ? 300 : 700] }}>
          Have any ideas for apps? Let us know!
        </div>
      ),
    },
  ];

  const [expanded, setExpanded] = React.useState(1);

  const handleChange = (panel: any) => {
    setExpanded(panel);
  };

  return (
    <div
      onMouseLeave={() => {
        handleChange(1);
      }}
      onBlur={() => {
        handleChange(1);
      }}
    >
      {apps.map((category: any, id: number) => (
        <Accordion
          key={id.toString()}
          square
          sx={{
            boxShadow: 0,
            margin: "0!important",
            borderRadius: "9px",
            cursor: "pointer",
            background: "transparent",
            "&:hover, &.Mui-expanded": {
              background:
                category.bg ??
                (global.theme === "dark"
                  ? "hsl(240, 11%, 40%)"
                  : colors[global.themeColor][200]),
            },
            transition: "all .2s",
            "&:before": {
              display: "none",
            },
            "& .MuiAccordionDetails-root": {
              opacity: 0,
              transform: "scale(.95)",
              transition: "all .3s",
            },
            "&:hover .MuiAccordionDetails-root, &.Mui-expanded .MuiAccordionDetails-root":
              {
                opacity: 1,
                transform: "scale(1)",
              },
          }}
          expanded={expanded === category.key}
          // onChange={handleChange(category.key)}
          onMouseOver={() => handleChange(category.key)}
          onClick={() => category.href !== "" && window.open(category.href)}
          onFocus={() => handleChange(category.key)}
        >
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{
              minHeight: "35px!important",
              maxHeight: "35px!important",
              color:
                global.theme === "dark"
                  ? "hsl(240, 11%, 90%)"
                  : colors[global.themeColor][900],
            }}
          >
            {category.label}
          </AccordionSummary>
          <AccordionDetails sx={{ pb: 1, pt: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color:
                  global.theme === "dark"
                    ? "hsl(240, 11%, 80%)"
                    : colors[global.themeColor][700],
              }}
            >
              {category.description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export function AppsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    open ? neutralizeBack(handleClose) : revivalBack();
  });

  return (
    <div>
      <Tooltip title="Apps">
        {global.user ? (
          <IconButton
            color="inherit"
            disableRipple
            sx={{
              mr: 1,
              borderRadius: 3,
              transition: "none",
              color: global.theme === "dark" ? "hsl(240, 11%, 90%)" : "#606060",
              "&:hover": {
                background: "rgba(200,200,200,.3)",
                color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
              },
              "&:focus-within": {
                background:
                  (global.theme === "dark"
                    ? colors[themeColor]["900"]
                    : colors[themeColor]["50"]) + "!important",
                color: global.theme === "dark" ? "hsl(240, 11%, 95%)" : "#000",
              },
            }}
            onClick={handleClick}
          >
            <span className="material-symbols-rounded">apps</span>
          </IconButton>
        ) : (
          <Skeleton
            sx={{ mr: 2 }}
            variant="circular"
            width={40}
            height={40}
            animation="wave"
          />
        )}
      </Tooltip>
      <Menu
        BackdropProps={{ sx: { opacity: { sm: "0!important" } } }}
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            background:
              global.theme === "dark"
                ? "hsl(240, 11%, 30%)"
                : colors[global.themeColor][100],
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography sx={{ my: 1.5, ml: 1.5, fontWeight: "800" }} variant="h6">
            Apps
          </Typography>
          <Products />
        </Box>
      </Menu>
    </div>
  );
}
