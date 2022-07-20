import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => (
  <Webcam
    style={{
      borderRadius: "28px",
      maxHeight: "70vh",
      background: "#232323",
      width: "100%",
    }}
  />
);

export default function Scan() {
  return (
    <Box>
      <Box sx={{ p: 2, mx: "auto", maxWidth: "500px" }}>
        <Typography variant="h5" sx={{ fontWeight: "700", my: 2 }}>
          Scan
        </Typography>
        <WebcamComponent />
        <Box
          sx={{
            background: "rgba(200,200,200,.3)",
            borderRadius: "28px",
            p: 3,
            mt: 3,
          }}
        >
          <Typography>Point your camera to an item</Typography>
        </Box>
      </Box>
    </Box>
  );
}
