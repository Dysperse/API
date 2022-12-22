import { Alert, IconButton, Link, Typography } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { TasksLayout } from "../components/Boards/Layout";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Head>
        <title>Tasks &bull; Carbon</title>
      </Head>
      {open && (
        <Alert
          variant="filled"
          severity="info"
          sx={{
            px: 4,
            py: 1,
            background: `linear-gradient(45deg, #E177D5 0%, #FFA655 100%)`,
            color: "#000",
            borderRadius: 0,
            ml: { sm: -1 },
            mt: { sm: 0.5 },
          }}
          action={
            <IconButton
              disableRipple
              onClick={() => setOpen(false)}
              sx={{
                float: "right",
                ml: 2,
              }}
              size="small"
              color="inherit"
            >
              <span className="material-symbols-rounded">close</span>
            </IconButton>
          }
        >
          <Typography sx={{ ml: 1 }}>
            Fill the 2022 annual user survey at{" "}
            <Link
              href="//survey.smartlist.tech"
              target="_blank"
              sx={{
                "&:focus": {
                  outline: "none",
                  boxShadow: "0 0 0 2px #000",
                },
                color: "#000",
                textDecorationColor: "#000",
              }}
            >
              survey.smartlist.tech
            </Link>
            &nbsp;
          </Typography>
        </Alert>
      )}
      <div className="pt-10 px-0">
        <TasksLayout />
      </div>
    </>
  );
}
