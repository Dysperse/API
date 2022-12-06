import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { useApi } from "../hooks/useApi";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../components/Puller";

function CreatePostMenu() {
  const [value, setValue] = React.useState("");
  const ref: any = React.useRef();

  useHotkeys("ctrl+v", (e) => {
    e.preventDefault();

    navigator.clipboard.readText().then((content) => {
      setValue(content.trim());
      if (ref.current) ref.current.focus();
    });
  });

  const [visibilityModalOpen, setVisibilityModalOpen] = React.useState(false);
  const [contentVisibility, setContentVisibility] = React.useState("Only me");

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={visibilityModalOpen}
        onClose={() => setVisibilityModalOpen(false)}
        onOpen={() => setVisibilityModalOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "20px 20px 0 0",
            maxWidth: "500px",
            mx: "auto",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography variant="h6" gutterBottom>
            Visibility
          </Typography>
          {[
            {
              name: "Only me",
              icon: "visibility",
              description: "Only you can see this note",
            },
            {
              name: "My group",
              icon: "group",
              description: "Members in your group can view and edit this note",
            },
          ].map((item) => (
            <Button
              onClick={() => {
                setContentVisibility(item.name);
                setVisibilityModalOpen(false);
              }}
              sx={{
                justifyContent: "flex-start",
                borderRadius: 3,
                gap: 2,
                my: 0.5,
              }}
              fullWidth
              size="large"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <Box
                sx={{
                  textAlign: "left",
                }}
              >
                <Typography variant="body1">{item.name}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.5,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
              {contentVisibility == item.name && (
                <span
                  className="material-symbols-outlined"
                  style={{ marginLeft: "auto" }}
                >
                  check
                </span>
              )}
            </Button>
          ))}
        </Box>
      </SwipeableDrawer>
      <Box
        sx={{
          background: "rgba(200,200,200,0.3)",
          borderRadius: 4,
          p: 2,
          border: "1px solid rgba(0,0,0,0)",
          "&, & *": {
            cursor: "pointer",
          },
          "&:focus-within": {
            background: "#fff",
            "&, & .MuiInput-root *": {
              cursor: "text",
            },
            border: "1px solid rgba(0,0,0,.5)",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
        onClick={() => {
          if (ref.current) ref.current.focus();
        }}
      >
        <TextField
          fullWidth
          placeholder="What's on your mind? Press Ctrl+V to paste from clipboard."
          autoComplete="off"
          multiline
          InputProps={{
            disableUnderline: true,
          }}
          variant="standard"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputRef={ref}
        />
        <Box sx={{ display: "flex", mt: 1, alignItems: "center", gap: 0.5 }}>
          <IconButton disableRipple>
            <span className="material-symbols-outlined">check_circle</span>
          </IconButton>
          <IconButton disableRipple>
            <span className="material-symbols-outlined">palette</span>
          </IconButton>
          <Button
            disableRipple
            sx={{
              transition: "all 0.2s ease",
              "&:active": {
                transition: "none",
                opacity: 0.6,
              },
              mt: "-1px",
              minWidth: "auto",
              gap: 2,
              ml: "auto",
              borderRadius: 999,
              color: "#666",
            }}
            onClick={() => setVisibilityModalOpen(true)}
          >
            <span className="material-symbols-outlined">visibility</span> Only
            me
          </Button>
          <Box
            sx={{
              height: "30px",
              borderLeft: "1px solid rgba(0,0,0,.1)",
            }}
          />
          <IconButton disableRipple>
            <span className="material-symbols-rounded">add_circle</span>
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

function Posts({ data }) {
  return (
    <>
      <CreatePostMenu />
      {data.length > 0 ? (
        JSON.stringify(data)
      ) : (
        <Box
          sx={{
            p: 2,
            mt: 3,
            background: "rgba(200,200,200,0.3)",
            borderRadius: "9px",
          }}
        >
          No posts yet
        </Box>
      )}
    </>
  );
}

export default function Insights() {
  const { data, error } = useApi("property/spaces");

  return global.user.email === "manusvathgurudath@gmail.com" ? (
    <Box
      sx={{
        p: 2,
      }}
      className="mt-5 sm:mt-10 max-w-xl mx-auto"
    >
      <Typography sx={{ fontWeight: "600", mb: 2 }} variant="h5" gutterBottom>
        Spaces
      </Typography>
      {data ? <Posts data={data} /> : <Box>Loading...</Box>}
    </Box>
  ) : (
    <div className="bg-gray-900 px-7 py-5 rounded-xl shadow-xl mt-10 max-w-lg mx-auto text-gray-50">
      <h1 className="text-xl">Gamify your productivity</h1>
      <h2 className="text-md mt-2 font-thin">
        Carbon Spaces is a place to store links, images, thoughts and more. With
        Spaces, you can organize your thoughts and ideas into a single place and
        access them from anywhere. You can also allow family/dorm members to see
        your posts!
      </h2>
      <Button
        className="text-gray-50 border-gray-50 border-2 mt-5 w-full hover:border-2 hover:border-gray-100"
        variant="outlined"
        onClick={() => {
          toast.success("You'll get an email when Spaces is released!");
        }}
      >
        Join the waitlist
      </Button>
    </div>
  );
}
