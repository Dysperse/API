import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Icon,
  Skeleton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { useSession } from "../../pages/_app";

/**
 * Product list
 * @returns {any}
 */
function Products({ styles }) {
  const apps = [
    {
      key: 1,
      href: "//my.dysperse.com",
      label: "Dysperse",
      description: "Next-gen personal home inventory",
    },
    {
      key: 2,
      label: (
        <>
          Availability
          <Chip
            label="NEW"
            sx={{
              background: "linear-gradient(45deg, #ff0f7b, #f89b29)",
              color: "#000",
              ml: 1,
            }}
            size="small"
          />
        </>
      ),
      href: "//availability.dysperse.com",
      description: "Find the best time for a group to get together",
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

  const session = useSession();

  return (
    <div onMouseLeave={() => handleChange(1)} onBlur={() => handleChange(1)}>
      {apps.map((category) => (
        <Accordion
          key={category.label.toString()}
          square
          sx={styles.accordion}
          expanded={expanded === category.key}
          onMouseOver={() => handleChange(category.key)}
          onClick={() => category.href !== "" && window.open(category.href)}
          onFocus={() => handleChange(category.key)}
        >
          <AccordionSummary
            id="panel1d-header"
            sx={{
              fontWeight: "500",
              minHeight: "35px!important",
              maxHeight: "35px!important",
              color: session?.user?.darkMode
                ? "hsl(240, 11%, 90%)"
                : colors[session?.themeColor][900],
            }}
          >
            {category.label}
          </AccordionSummary>
          <AccordionDetails sx={{ pb: 1, pt: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: session?.user?.darkMode
                  ? "hsl(240, 11%, 80%)"
                  : colors[session?.themeColor][700],
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

function Apps({ styles }) {
  const apps = [
    {
      key: 4,
      label: "Web",
    },
    {
      key: 1,
      label: "Windows & Mac",
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
  const session = useSession();
  return (
    <div onMouseLeave={() => handleChange(0)} onBlur={() => handleChange(0)}>
      {apps.map((category) => (
        <Accordion
          key={category.label.toString()}
          square
          sx={styles.accordion}
          expanded={expanded === category.key}
          onMouseOver={() => handleChange(category.key)}
          onFocus={() => handleChange(category.key)}
        >
          <AccordionSummary
            id="panel1d-header"
            sx={{
              fontWeight: "500",
              minHeight: "35px!important",
              maxHeight: "35px!important",
              color: session?.user?.darkMode
                ? "hsl(240, 11%, 90%)"
                : colors[session?.themeColor][900],
            }}
          >
            {category.label}
          </AccordionSummary>
          <AccordionDetails sx={{ pb: 1, pt: 0 }}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: "200px",
                color: session?.user?.darkMode
                  ? "hsl(240, 11%, 80%)"
                  : colors[session?.themeColor][700],
              }}
            >
              {category.label === "Web" ? (
                <>You&apos;re using Dysperse for Web</>
              ) : (
                <>Coming soon!</>
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
export default function AppsMenu({ styles }) {
  const [open, setOpen] = React.useState<boolean>(false);

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
  const session = useSession();
  const appMenuStyles = {
    accordion: {
      boxShadow: "none!important",
      margin: "0!important",
      borderRadius: "9px",
      cursor: "pointer",
      background: "transparent",
      "&:hover, &.Mui-expanded": {
        background: session?.user?.darkMode
          ? "hsl(240,11%,30%)"
          : colors[session?.themeColor][50],
      },
      transition: "all .2s, background 0s",
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
    },
  };
  return (
    <>
      {session?.user ? (
        <Button
          color="inherit"
          size="large"
          onClick={handleClick}
          fullWidth
          sx={{
            justifyContent: "start",
            p: 2,
            py: 1.5,
            borderRadius: 0,
            gap: 2,
            color: `hsl(240,11%,${session?.user?.darkMode ? 90 : 10}%)`,
          }}
        >
          <Icon className="outlined">workspaces</Icon>
          Workspace
        </Button>
      ) : (
        <Skeleton
          sx={{ mr: 2 }}
          variant="circular"
          width={40}
          height={40}
          animation="wave"
        />
      )}
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
            maxHeight: "calc(100vh - 40px)",
            overflowY: "auto",
          },
        }}
        open={open}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography sx={{ my: 1.5, ml: 1.5, fontWeight: "800" }} variant="h6">
            Apps
          </Typography>
          <Products styles={appMenuStyles} />
          <Typography sx={{ my: 1.5, ml: 1.5, fontWeight: "800" }} variant="h6">
            Platforms
          </Typography>
          <Apps styles={appMenuStyles} />

          <Box
            sx={{
              borderTop:
                "1px solid " +
                (session?.user?.darkMode
                  ? "hsl(240,11%,30%)"
                  : colors[session?.themeColor || "grey"][50]),
              mt: 2,
              pt: 2,
            }}
          />
          <Button
            disableRipple
            target="_blank"
            size="small"
            href="https://dysperse.com/support"
            sx={{ cursor: "pointer!important" }}
          >
            Support center
            <Icon>east</Icon>
          </Button>
          <Button
            disableRipple
            target="_blank"
            size="small"
            href="https://discord.gg/fvngmDzh77"
            sx={{ cursor: "pointer!important" }}
          >
            Community Discord
            <Icon>east</Icon>
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
