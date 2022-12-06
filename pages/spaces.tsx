import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import toast from "react-hot-toast";
import useSWR from "swr";
import React from "react";
import { useApi } from "../hooks/useApi";
import TextField from "@mui/material/TextField";
import { useHotkeys } from "react-hotkeys-hook";

function Posts({ data }) {
  const [value, setValue] = React.useState("");
  const ref: any = React.useRef();

  useHotkeys("ctrl+v", (e) => {
    e.preventDefault();
    navigator.clipboard.readText().then((text) => {
      setValue(text.trim());
      if (ref.current) ref.current.focus();
    });
  });
  return (
    <>
      <TextField
        fullWidth
        placeholder="What's on your mind? Press Ctrl+V to paste from clipboard."
        autoComplete="off"
        multiline
        InputProps={{
          disableUnderline: true,
          sx: {
            background: "rgba(200,200,200,0.3)",
            mb: 2,
            borderRadius: 4,
            p: 2,
            border: "1px solid rgba(0,0,0,0)",
            "&:focus-within": {
              background: "#fff",
              border: "1px solid rgba(0,0,0,.5)",
              boxShadow: "3px 3px 5px rgba(0,0,0,.2)",
            },
          },
        }}
        variant="standard"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputRef={ref}
      />
      {data.length > 0 ? (
        JSON.stringify(data)
      ) : (
        <Box
          sx={{
            p: 2,
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
      className="mt-5 sm:mt-10"
    >
      <Typography sx={{ fontWeight: "600" }} variant="h5" gutterBottom>
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
