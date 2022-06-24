import { useState, useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import * as colors from "@mui/material/colors";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import React from "react";
import { neutralizeBack, revivalBack } from "../../history-control";

function Cards({ transactions }: any) {
  const [activeStep, setActiveStep] = React.useState(0);

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {activeStep === transactions.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            You finished reviewing your expenses!
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Button
              onClick={handleReset}
              variant="contained"
              disableElevation
              sx={{ borderRadius: 4, mt: 2 }}
              size="large"
            >
              Reset
            </Button>
          </Box>
        </React.Fragment>
      ) : (
        <Box
          sx={{
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Stepper
              activeStep={activeStep}
              sx={{
                "& .MuiStepConnector-root": {
                  display: "none",
                },
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                "& .MuiStepIcon-text": { display: "none" },
              }}
            >
              {transactions.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: any = {};
                return (
                  <Step key={index.toString()} {...stepProps}>
                    <StepLabel {...labelProps}></StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Card
              sx={{
                mt: 5,
                mb: 2,
                py: 10,
                px: 6,
                borderRadius: 5,
                width: "500px",
                mx: "auto",
                maxWidth: "calc(100vw - 40px)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: "800",
                    fontSize: { xs: "25px", sm: "40px" },
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {transactions[activeStep].name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                    opacity: 0.7,

                    fontSize: { xs: "15px", sm: "25px" },
                  }}
                >
                  ${transactions[activeStep].amount} &bull; 5 days ago
                </Typography>
              </CardContent>
            </Card>
            <Box
              sx={{
                textAlign: "center",
                alignItems: "center",
                background: "rgba(255,255,255,.1)",
                borderRadius: 5,
                maxWidth: "calc(100vw - 40px)",
                p: 3,
                mx: "auto",
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Was it worth it?
              </Typography>
              <IconButton onClick={handleNext} color="inherit" size="large">
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: "40px" }}
                >
                  sentiment_dissatisfied
                </span>
              </IconButton>
              <IconButton onClick={handleNext} color="inherit" size="large">
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: "40px" }}
                >
                  sentiment_neutral
                </span>
              </IconButton>
              <IconButton onClick={handleNext} color="inherit" size="large">
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: "40px" }}
                >
                  sentiment_very_satisfied
                </span>
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function ReviewExpenses({ transactions, children }: any) {
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });
  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <SwipeableDrawer
        open={open}
        swipeAreaWidth={0}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{
          sx: {
            color: "white",
            background: colors[themeColor]["900"],
          },
        }}
      >
        <Box sx={{ height: "100vh", width: "100vw" }}>
          <AppBar
            elevation={0}
            sx={{
              background: "transparent",
              color: "white",
              py: 1,
            }}
          >
            <Toolbar>
              <IconButton
                onClick={() => setOpen(false)}
                color="inherit"
                size="large"
                sx={{ mr: 2, ml: -0.5 }}
              >
                <span className="material-symbols-rounded">close</span>
              </IconButton>
              <Typography>Review expenses</Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Cards transactions={transactions} />
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
