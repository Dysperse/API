import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Icon,
  IconButton,
  Skeleton,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";

/**
 * Product list
 * @returns {any}
 */
function Products() {
  const apps = [
    {
      key: 1,
      href: "//my.smartlist.tech",
      label: "Carbon",
      description: "Next-gen personal home inventory",
    },
    {
      key: 2,
      label: "Availability",
      href: "//availability.smartlist.tech",
      description:
        "Find the best time for a group to get together (Coming soon!)",
    },
  ];

  const [expanded, setExpanded] = React.useState(1);

  /**
   * @param {any} panel
   * @returns {any}
   */
  const handleChange = (panel: number) => {
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
      {apps.map((category) => (
        <Accordion
          key={category.label.toString()}
          square
          sx={{
            boxShadow: "none!important",
            margin: "0!important",
            borderRadius: "9px",
            cursor: "pointer",
            background: "transparent",
            "&:hover, &.Mui-expanded": {
              background:
                colors[global.themeColor][global.user.darkMode ? 900 : 100],
              // category.bg ??
              // (global.user.darkMode
              //   ? "hsl(240, 11%, 40%)"
              //   : colors[global.themeColor][200]),
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
          onMouseOver={() => handleChange(category.key)}
          onClick={() => category.href !== "" && window.open(category.href)}
          onFocus={() => handleChange(category.key)}
        >
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{
              fontWeight: "500",
              minHeight: "35px!important",
              maxHeight: "35px!important",
              color: global.user.darkMode
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
                color: global.user.darkMode
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

function Apps() {
  const apps = [
    {
      key: 4,
      label: "Web",
    },
    {
      key: 1,
      label: "Windows",
    },
    {
      key: 2,
      label: "Android",
    },
    {
      key: 3,
      label: "iOS",
    },
  ];

  const [expanded, setExpanded] = React.useState(0);

  /**
   * @param {any} panel
   * @returns {any}
   */
  const handleChange = (panel: number) => {
    setExpanded(panel);
  };

  return (
    <div
      onMouseLeave={() => {
        handleChange(0);
      }}
      onBlur={() => {
        handleChange(0);
      }}
    >
      {apps.map((category) => (
        <Accordion
          key={category.label.toString()}
          square
          sx={{
            boxShadow: "none!important",
            margin: "0!important",
            borderRadius: "9px",
            cursor: "pointer",
            background: "transparent",
            "&:hover, &.Mui-expanded": {
              background:
                colors[global.themeColor][global.user.darkMode ? 900 : 100],
              // category.bg ??
              // (global.user.darkMode
              //   ? "hsl(240, 11%, 40%)"
              //   : colors[global.themeColor][200]),
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
          onMouseOver={() => handleChange(category.key)}
          onFocus={() => handleChange(category.key)}
        >
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{
              fontWeight: "500",
              minHeight: "35px!important",
              maxHeight: "35px!important",
              color: global.user.darkMode
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
                maxWidth: "200px",
                color: global.user.darkMode
                  ? "hsl(240, 11%, 80%)"
                  : colors[global.themeColor][700],
              }}
            >
              {category.label === "Web" ? (
                <>You&apos;re using Carbon for Web</>
              ) : (
                <>
                  (Coming soon) Download Carbon for {category.label} for extra
                  features such as push notifications, assistant, and more!
                </>
              )}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

/**
 * Apps menu
 * @returns {any}
 */
export function AppsMenu({ styles }) {
  const [open, setOpen] = React.useState<boolean>(false);
  useStatusBar(open);
  useHotkeys(
    "ctrl+q",
    (e) => {
      e.preventDefault();
      setOpen(!open);
    },
    [open]
  );

  /**
   * Handles app menu trigger
   * @param {React.MouseEvent<HTMLElement>} event
   * @returns {any}
   */
  const handleClick = () => setOpen(true);
  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    open ? neutralizeBack(handleClose) : revivalBack();
  });

  return (
    <>
      <Tooltip title="Apps">
        {global.user ? (
          <IconButton
            disabled={!window.navigator.onLine}
            color="inherit"
            disableRipple
            sx={styles}
            onClick={handleClick}
          >
            <Icon>apps</Icon>
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
      <SwipeableDrawer
        disableSwipeToOpen
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor="right"
        PaperProps={{
          sx: {
            width: "300px",
            m: 2,
            borderRadius: 5,
            height: "auto",
            background: global.user.darkMode
              ? "hsl(240, 11%, 20%)"
              : colors[global.themeColor][50],
            color: global.user.darkMode
              ? "hsl(240, 11%, 90%)"
              : colors[global.themeColor][900],
            maxHeight: "calc(100vh - 40px)",
            overflowY: "auto",
          },
        }}
        open={open}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography sx={{ my: 1.5, ml: 1.5, fontWeight: "800" }} variant="h6">
            Workspace
          </Typography>
          <Products />
          <Typography sx={{ my: 1.5, ml: 1.5, fontWeight: "800" }} variant="h6">
            Platforms
          </Typography>
          <Apps />

          <Box
            sx={{
              borderTop: "1px solid " + colors[themeColor][100],
              mt: 3,
              pt: 2,
            }}
          />
          <Button
            disableRipple
            target="_blank"
            sx={{ transition: "none", gap: 1 }}
            href="https://smartlist.tech/support"
            size="small"
          >
            Knowledge base
            <Icon>arrow_forward</Icon>
          </Button>
          <Button
            disableRipple
            target="_blank"
            sx={{ transition: "none", gap: 1 }}
            href="https://discord.gg/fvngmDzh77"
            size="small"
          >
            Community Discord
            <Icon>arrow_forward</Icon>
          </Button>
          <Button
            disableRipple
            target="_blank"
            sx={{ transition: "none", gap: 1 }}
            href="/feedback"
            size="small"
          >
            Have feedback? Let us know!
            <Icon>arrow_forward</Icon>
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
