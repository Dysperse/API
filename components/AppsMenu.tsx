import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import TipsAndUpdates from "@mui/icons-material/TipsAndUpdates";
import { green } from "@mui/material/colors";
import * as colors from "@mui/material/colors";

import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Link from "@mui/material/Link";
import Accordion from "@mui/material/Accordion";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useForm, ValidationError } from "@formspree/react";

function ContactForm() {
  const [state, handleSubmit] = useForm("mbjqjeyo");
  if (state.succeeded) {
    return (
      <Box sx={{ borderRadius: 3, background: "rgba(200,200,200,.3)", p: 2 }}>
        Thanks for suggesting! We'll review your feedback
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
          boxShadow: 0
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
  const [open, setOpen] = useState(false);
  const stopPropagationForTab = (event: any) => {
    if (event.key !== "Esc") {
      event.stopPropagation();
    }
  };

  return (
    <>
      <Box sx={{ color: green[900] }} onClick={() => setOpen(true)}>
        <TipsAndUpdates
          sx={{ verticalAlign: "middle", mr: 1, transform: "scale(.8)" }}
        />
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
            borderRadius: "28px"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: "800", py: 3 }}>Feedback</DialogTitle>
        <DialogContent>
          <ContactForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

const categories = [
  {
    key: 1,
    label: "Smartlist",
    description: "Home inventory and finance management"
  },
  {
    key: 2,
    label: "Collaborate",
    description: "Plan events with collaborators in real-time"
  },
  { label: "Recipes", description: "Recipe ideas based on your inventory" },
  {
    key: 3,
    label: "Availability",
    description: "Find the best time for a group to get together"
  },
  {
    key: 4,
    label: "Dressing",
    description: "Match dress sizes which fit you in multiple stores"
  },
  {
    key: 5,
    bg: green[200],
    href: "https://smartlist.tech/discord",
    label: <SuggestButton />,
    description: "Have any ideas for apps? Let us know!"
  }
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
      {categories.map((category) => (
        <Accordion
          square
          sx={{
            boxShadow: 0,
            margin: "0!important",
            borderRadius: "9px",
            background: "transparent",
            "&:hover, &.Mui-expanded": {
              background: category.bg ?? colors[global.themeColor][200]
            },
            transition: "all .2s",
            "&:before": {
              display: "none"
            },
            "& .MuiAccordionDetails-root": {
              opacity: 0,
              transform: "scale(.95)",
              transition: "all .3s"
            },
            "&:hover .MuiAccordionDetails-root, &.Mui-expanded .MuiAccordionDetails-root": {
              opacity: 1,
              transform: "scale(1)"
            }
          }}
          expanded={expanded === category.key}
          // onChange={handleChange(category.key)}
          onMouseOver={() => handleChange(category.key)}
          onClick={() => handleChange(category.key)}
          onFocus={() => handleChange(category.key)}
        >
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{
              minHeight: "35px!important",
              maxHeight: "35px!important"
            }}
          >
            <Link
              underline="none"
              target="_blank"
              href={category.href}
              component="button"
              sx={{ fontSize: "16px", color: colors[global.themeColor][800] }}
            >
              {category.label}
            </Link>
          </AccordionSummary>
          <AccordionDetails sx={{ pb: 1, pt: 0 }}>
            <Link
              underline="none"
              target="_blank"
              href={category.href}
              component="button"
              sx={{ fontSize: "16px" }}
            >
              <Typography variant="body2" sx={{ color: "#505050" }}>
                {category.description}
              </Typography>
            </Link>
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

  return (
    <div>
      <Tooltip title="Apps">
        {global.session ? (
          <IconButton
            color="inherit"
            edge="end"
            size="large"
            sx={{
              transition: "none",
              mr: 1,
              ml: 0.5,
              color: "#404040",
              "&:hover": { color: "#000" }
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
        BackdropProps={{ sx: { opacity: "0!important" } }}
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            boxShadow: 0,
            background: colors[global.themeColor][100]
          }
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography sx={{ my: 1.5, ml: 1.5 }} variant="h6">
            Apps
          </Typography>
          <Products />
        </Box>
      </Menu>
    </div>
  );
}
