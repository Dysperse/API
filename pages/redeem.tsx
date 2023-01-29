import React from "react";
import toast from "react-hot-toast";
import { colors } from "../lib/colors";

import { Box, Button, TextField, Typography } from "@mui/material";
import { toastStyles } from "../lib/useCustomTheme";

export default function Redeem() {
  const [code, setCode] = React.useState("");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          background: "rgba(200,200,200,0.3)",
          borderRadius: 5,
          p: 4,
          width: "500px",
          maxWidth: "calc(100% - 20px)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Redeem
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Enter a code below to redeem
        </Typography>
        <TextField
          value={code}
          onChange={(e) => setCode(e.target.value)}
          id="outlined-basic"
          label="Code"
          variant="filled"
        />
        <Button
          size="large"
          fullWidth
          onClick={() => {
            toast.promise(
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  if (code === "CRB-G721428") {
                    resolve("Success! Your account has been upgraded for free");
                  } else {
                    reject("Invalid Code!");
                  }
                  setCode("");
                }, 2000);
              }),
              {
                loading: "Redeeming...",
                success: "Success!",
                error: (err) => {
                  return err;
                },
              },
              toastStyles
            );
          }}
          sx={{
            mt: 2,
            borderRadius: 99,
            background: colors[themeColor][900] + "!important",
            color: colors[themeColor][50] + "!important",
          }}
        >
          Claim
        </Button>
      </Box>
    </Box>
  );
}
