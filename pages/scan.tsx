import Box from "@mui/material/Box";
import React from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;

export default function Scan() {
  return (
    <Box>
      <WebcamComponent />
    </Box>
  );
}
