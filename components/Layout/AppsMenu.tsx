import * as colors from "@mui/material/colors";
import { green } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { neutralizeBack, revivalBack } from "../history-control";

function ContactForm() {
  const [state, handleSubmit] = useForm("mbjqjeyo");
  if (state.succeeded) {
    return (
      <Box sx={{ borderRadius: 3, background: "rgba(200,200,200,.3)", p: 2 }}>
        Thanks for suggesting! We&apos;ll review your feedback
      </Box>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        sx={{ my: 1 }}
        label="Your email..."
        defaultValue={global.session && global.session.email}
        id="email"
        required
        autoComplete="off"
        type="email"
        name="email"
        variant="filled"
        fullWidth
      />
      <ValidationError prefix="Email" field="email" errors={state.errors} />
      <br />
      <TextField
        required
        variant="filled"
        autoComplete="off"
        fullWidth
        label="What can we improve?"
        id="message"
        name="message"
      />
      <ValidationError prefix="Message" field="message" errors={state.errors} />
      <br />
      <Button
        type="submit"
        sx={{
          mt: 1,
          float: "right",
          borderRadius: 9,
          boxShadow: 0,
        }}
        size="large"
        variant="contained"
        disabled={state.submitting}
      >
        Submit
      </Button>
    </form>
  );
}

function SuggestButton() {
  const [open, setOpen] = useState<boolean>(false);
  const stopPropagationForTab = (event: any) => {
    if (event.key !== "Esc") {
      event.stopPropagation();
    }
  };

  return (
    <>
      <Box
        sx={{
          color: green[global.theme === "dark" ? 100 : 900],
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined">tips_and_updates</span>
        Suggest an app
      </Box>
      <Dialog
        onKeyDown={stopPropagationForTab}
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "400px",
            maxWidth: "calc(100vw - 10px)",
            p: 2,
            borderRadius: "28px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "700", py: 3 }}>Feedback</DialogTitle>
        <DialogContent>
          <ContactForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

const apps = [
  {
    key: 1,
    href: "//my.smartlist.tech",
    label: "Carbon",
    description: "Home inventory and finance management",
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
    href: "",
    label: <SuggestButton />,
    description: (
      <div style={{ color: green[global.theme === "dark" ? 300 : 700] }}>
        Have any ideas for apps? Let us know!
      </div>
    ),
  },
];

function Products() {
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
        {global.session ? (
          <IconButton
            color="inherit"
            disableRipple
            sx={{
              mr: 1,
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
